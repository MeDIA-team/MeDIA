import 'dayjs/locale/ja'

import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'
import Ajv, { ValidationError } from 'ajv'

import { Client } from '@elastic/elasticsearch'

import {
  dumpSchemas as configDumpSchemas,
  flattenDataTypeIds,
  validate as configValidate,
} from './config'
import { logStdout } from './utils'

dayjs.locale('ja')

export type EntryFileType = 'data' | 'patient' | 'sample'

// ts-node <script> ['data' | 'patient' | 'sample'] <configFilePath> <entryFilePath>
export const parseAndValidateArgs = (): [EntryFileType, string, string] => {
  if (process.argv.length < 5) {
    throw new Error(
      "The argument is incorrect.\n    `ts-node <script> ['data' | 'patient' | 'sample'] <configFilePath> <entryFilePath>`"
    )
  }
  const entryFileType = process.argv[2]
  const configFilePath = path.resolve(process.argv[3])
  const entryFilePath = path.resolve(process.argv[4])
  if (!['data', 'patient', 'sample'].includes(entryFileType)) {
    throw new Error(
      'For entry file type, specify one of [data, patient, or sample].'
    )
  }
  if (!fs.existsSync(configFilePath)) {
    throw new Error(
      `The inputted config file path: ${configFilePath} does not exist.`
    )
  }
  if (!fs.existsSync(entryFilePath)) {
    throw new Error(
      `The inputted entry file path: ${entryFilePath} does not exist.`
    )
  }
  return [entryFileType as EntryFileType, configFilePath, entryFilePath]
}

export const validateEntryFile = async (
  entryFileType: EntryFileType,
  configFilePath: string,
  entryFilePath: string
): Promise<void> => {
  const schemaFilePath = path.resolve(
    __dirname,
    `../schema/${entryFileType}.schema.json`
  )
  if (!fs.existsSync(schemaFilePath)) {
    throw new Error(`Could not find schema file: ${schemaFilePath}.`)
  }
  const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf-8'))
  const entries = JSON.parse(fs.readFileSync(entryFilePath, 'utf-8'))
  const ajv = new Ajv()
  const valid = await ajv.validate(schema, entries)
  if (!valid) {
    if (ajv.errors) {
      throw new ValidationError(ajv.errors)
    } else {
      throw new Error('Unexpected error occurred in validation.')
    }
  }
  const config: Config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  const dataTypeIds: string[] = config.selector.dataType.flatMap((field) =>
    flattenDataTypeIds(field)
  )
  if (entryFileType === 'data') {
    for (const entry of entries as DataEntry[]) {
      if (!dataTypeIds.includes(entry.dataType as string)) {
        throw new Error(
          `[Validation Error] The inputted entry file contained an invalid id: ${entry.dataType}, which is not included in the inputted config file.`
        )
      }
    }
  } else if (entryFileType === 'patient') {
    for (const entry of entries as PatientEntry[]) {
      for (const sample of entry.samples) {
        for (const dataType of sample.dataTypes) {
          if (!dataTypeIds.includes(dataType.name)) {
            throw new Error(
              `[Validation Error] The inputted entry file contained an invalid id: ${dataType.name}, which is not included in the inputted config file.`
            )
          }
        }
      }
    }
  } else if (entryFileType === 'sample') {
    for (const entry of entries as SampleEntry[]) {
      for (const dataType of entry.dataTypes) {
        if (!dataTypeIds.includes(dataType.name)) {
          throw new Error(
            `[Validation Error] The inputted entry file contained an invalid id: ${dataType.name}, which is not included in the inputted config file.`
          )
        }
      }
    }
  }
}

export const newEsClient = (): Client => {
  const esClient = new Client({
    node: process.env.ES_URL || 'http://db:9200',
  })
  if (esClient.connectionPool.connections.length === 0) {
    throw new Error('ES client connection does not exist.')
  }
  if (
    esClient.connectionPool.connections[0].status !==
    esClient.connectionPool.Connection.statuses.ALIVE
  ) {
    throw new Error(
      `The status of the es client connection is ${esClient.connectionPool.connections[0].status}.`
    )
  }
  return esClient
}

const INDEX_SETTINGS = {
  number_of_shards: 1,
  number_of_replicas: 0,
}

const INDEX_SETTINGS_FOR_ENTRIES = {
  ...INDEX_SETTINGS,
  max_result_window: 10000000,
  'index.mapping.total_fields.limit': 10000,
  'index.mapping.nested_objects.limit': 100000,
}

export const existsIndex = async (
  esClient: Client,
  index: EntryFileType | 'config'
): Promise<boolean> => {
  const res = await esClient.indices.exists({ index })
  return !!res.body
}

export const createIndex = async (
  esClient: Client,
  index: EntryFileType | 'config',
  settings: typeof INDEX_SETTINGS | typeof INDEX_SETTINGS_FOR_ENTRIES,
  mappings: Record<string, unknown>
): Promise<void> => {
  if (!(await existsIndex(esClient, index))) {
    await esClient.indices.create({
      index,
      body: { settings, mappings },
    })
  }
}

interface NestedObj {
  type: 'nested'
  properties: Record<string, unknown>
}

const esType = (jsonSchemaType: 'string' | 'integer' | 'date') => {
  return jsonSchemaType === 'string' ? 'keyword' : jsonSchemaType
}

export const esMappings = (
  entryFileType: EntryFileType,
  configFilePath: string
): { properties: Record<string, unknown> } => {
  const config: Config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  const mappings = {
    properties: {} as Record<string, unknown>,
  }
  if (entryFileType === 'data') {
    for (const field of config.filter.fields) {
      mappings.properties[field.id] = { type: esType(field.type) }
    }
  } else if (entryFileType === 'patient') {
    mappings.properties.samples = {
      type: 'nested',
      properties: {} as Record<string, unknown>,
    }
    for (const field of config.filter.fields) {
      if (field.id === 'patientId') {
        mappings.properties.patientId = { type: esType(field.type) }
      } else if (field.id === 'dataType') {
        ;(mappings.properties.samples as NestedObj).properties.dataTypes = {
          type: 'nested',
          properties: {
            name: { type: esType(field.type) },
          },
        }
      } else {
        ;(mappings.properties.samples as NestedObj).properties[field.id] = {
          type: esType(field.type),
        }
      }
    }
  } else if (entryFileType === 'sample') {
    for (const field of config.filter.fields) {
      if (field.id === 'dataType') {
        mappings.properties.dataTypes = {
          type: 'nested',
          properties: {
            name: { type: esType(field.type) },
          },
        }
      } else {
        mappings.properties[field.id] = { type: esType(field.type) }
      }
    }
  }
  return mappings
}

const splitEntries = (entries: Record<string, unknown>[], splitNum: number) => {
  const chunkSize = Math.ceil(entries.length / splitNum)
  return new Array(splitNum)
    .fill(null)
    .map((_, i) => entries.slice(i * chunkSize, (i + 1) * chunkSize))
}

// bulk は http request body size の制限から 100MB までの制限がある
// entryFilePath の size を確認して、適度に分割する
// 50MB を上限として分割する
// fileSize を取得 -> 50MB で割る -> 分割数に応じて中に含まれている arr を split する -> Bulk insert
export const bulkData = async (
  esClient: Client,
  index: EntryFileType,
  entryFilePath: string
): Promise<void> => {
  const originalEntries = JSON.parse(fs.readFileSync(entryFilePath, 'utf-8'))
  const fileSize = fs.statSync(entryFilePath).size
  for (const entries of splitEntries(
    originalEntries,
    Math.ceil(fileSize / 50000000)
  )) {
    const body = entries.flatMap((entry) => [
      { index: { _index: index } },
      entry,
    ])
    const { body: bulkResponse } = await esClient.bulk({
      refresh: true,
      body,
    })
    if (bulkResponse.errors) {
      const errorDocs = bulkResponse.items.flatMap(
        (
          action: Record<string, { error?: unknown; status?: unknown }>,
          i: number
        ) =>
          Object.values(action)
            .filter((val) => !!val.error)
            .map((val) => ({
              status: val.status,
              error: val.error,
              operation: body[i * 2],
              document: body[i * 2 + 1],
            }))
      )
      throw new Error(`[Bulk Error]\n${JSON.stringify(errorDocs, null, 2)}`)
    }
  }
}

export const updateIndexFielddata = async (
  esClient: Client,
  index: EntryFileType
): Promise<void> => {
  if (['patient', 'sample'].includes(index)) {
    const res = await esClient.indices.getMapping({
      index,
    })
    const mappings = res.body[index].mappings
    if (index === 'patient') {
      for (const [key, value] of Object.entries(
        mappings.properties.samples.properties.dataTypes.properties
      )) {
        if ((value as { type: string }).type === 'text') {
          mappings.properties.samples.properties.dataTypes.properties[
            key
          ].fielddata = true
        }
      }
    } else if (index === 'sample') {
      for (const [key, value] of Object.entries(
        mappings.properties.dataTypes.properties
      )) {
        if ((value as { type: string }).type === 'text') {
          mappings.properties.dataTypes.properties[key].fielddata = true
        }
      }
    }
    await esClient.indices.putMapping({
      index,
      body: mappings,
    })
  }
}

const insertConfigData = async (esClient: Client, configFilePath: string) => {
  const config: Config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  await esClient.index({
    index: 'config',
    body: config,
  })
}

export const main = async (): Promise<void> => {
  logStdout('Start to bulk the entry file.')
  const esClient: Client = newEsClient()
  const [entryFileType, configFilePath, entryFilePath] = parseAndValidateArgs()
  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  logStdout('Validating the config file...')
  await configValidate(config)
  logStdout('Dumping entry file schemas...')
  configDumpSchemas(config)
  logStdout('Validating the entry file...')
  await validateEntryFile(entryFileType, configFilePath, entryFilePath)
  if (await existsIndex(esClient, entryFileType)) {
    logStdout(`Index: ${entryFileType} already exists.`)
  } else {
    logStdout(`Creating the ES index: ${entryFileType}...`)
    await createIndex(
      esClient,
      entryFileType,
      INDEX_SETTINGS_FOR_ENTRIES,
      esMappings(entryFileType, configFilePath)
    )
  }
  logStdout('Bulking the entry data...')
  await bulkData(esClient, entryFileType, entryFilePath)
  logStdout('Updating the dataTypes filed in mappings....')
  await updateIndexFielddata(esClient, entryFileType)
  if (!(await existsIndex(esClient, 'config'))) {
    logStdout('Inserting config data...')
    await insertConfigData(esClient, configFilePath)
  }
  logStdout('Finish to bulk the entry file.')
}

if (require.main === module) {
  main()
}
