/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dayjs/locale/ja'

import fs from 'fs'
import Ajv from 'ajv'
import { Client } from '@elastic/elasticsearch'
import dayjs from 'dayjs'

dayjs.locale('ja')

export const parseArgs = (): string[] => {
  if (process.argv.length < 3) {
    throw new Error(
      'The file paths you want to do bulk processing are not included.'
    )
  }

  return process.argv.slice(2)
}

export const generateEsClient = (): Client => {
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

export class ValidationError extends Error {
  filePath: string
  originalError: Error
  errors: Ajv.ErrorObject[] | null | undefined

  constructor(
    originalError: Error,
    filePath: string,
    errors?: Ajv.ErrorObject[] | null | undefined
  ) {
    super(originalError.message)
    this.filePath = filePath
    this.originalError = originalError
    this.errors = errors
  }
}

export const validateFiles = async (
  filePaths: string[],
  schemaFilePath: string
) => {
  logStdout('Start to validate data json files.')
  const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf-8'))

  const validateFile = async (filePath: string) => {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8')
    const fileObj = await JSON.parse(fileContent)
    const ajv = new Ajv()
    const valid = await ajv.validate(schema, fileObj)
    if (!valid) {
      throw new ValidationError(
        new Error('Validation failed'),
        filePath,
        ajv.errors
      )
    }
  }

  const queue = []
  for (const filePath of filePaths) {
    logStdout(`Validating ${filePath}.`)
    queue.push(validateFile(filePath))
  }

  await Promise.all(queue)

  logStdout('Finish to validate data json files.')
}

const INDEX_SETTINGS = {
  number_of_shards: 1,
  number_of_replicas: 0,
  max_result_window: 10000000,
  'index.mapping.total_fields.limit': 10000,
  'index.mapping.nested_objects.limit': 50000,
}

export const createDataEsIndex = async (
  esClient: Client,
  mappings: any,
  index: string
) => {
  logStdout('Start to create ES index.')
  const res = await esClient.indices.exists({ index })
  if (!res.body) {
    await esClient.indices.create({
      index,
      body: { settings: INDEX_SETTINGS, mappings },
    })
    logStdout('Finish to create ES index.')
  }
}

class BulkError extends Error {
  filePath: string
  errorDocs: {
    status: any
    error: any
    operation: any
    document: any
  }[]

  constructor(
    filePath: string,
    errorDocs: {
      status: any
      error: any
      operation: any
      document: any
    }[]
  ) {
    super('Bulk processing failed.')
    this.filePath = filePath
    this.errorDocs = errorDocs
  }
}

class OtherBulkError extends Error {
  originalError: Error
  filePath: string

  constructor(originalError: Error, filePath: string) {
    super('Bulk processing failed.')
    this.originalError = originalError
    this.filePath = filePath
  }
}

class AllBulkError extends Error {
  errors: Array<Error | OtherBulkError>

  constructor(errors: Array<Error | OtherBulkError>) {
    super('Bulk processing failed.')
    this.errors = errors
  }
}

export const bulkData = async (
  esClient: Client,
  filePaths: string[],
  index: string
) => {
  logStdout('Start to bulk data json files.')

  const bulkFile = async (filePath: string) => {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8')
    const fileObj = await JSON.parse(fileContent)
    const body = fileObj.flatMap((doc: any) => [
      { index: { _index: index } },
      doc,
    ])
    const { body: bulkResponse } = await esClient.bulk({ refresh: true, body })
    if (bulkResponse.errors) {
      const errorDocs: {
        status: any
        error: any
        operation: any
        document: any
      }[] = []
      bulkResponse.items.forEach(
        (action: { [x: string]: { error: any; status: any } }, i: number) => {
          const operation = Object.keys(action)[0]
          if (action[operation].error) {
            errorDocs.push({
              status: action[operation].status,
              error: action[operation].error,
              operation: body[i * 2],
              document: body[i * 2 + 1],
            })
          }
        }
      )
      throw new BulkError(filePath, errorDocs)
    }
  }

  const errors: Array<BulkError | OtherBulkError> = []
  for (const filePath of filePaths) {
    logStdout(`Bulking ${filePath}.`)
    await bulkFile(filePath).catch((e) => {
      if (e instanceof BulkError) {
        errors.push(e)
      } else {
        errors.push(new OtherBulkError(e, filePath))
      }
    })
  }

  if (errors.length) {
    throw new AllBulkError(errors)
  }

  logStdout('Finish to bulk data json files.')
}

export const updateIndexFielddata = async (esClient: Client, index: string) => {
  logStdout("Start to update index's fielddata.")
  const res = await esClient.indices.getMapping({
    index,
  })
  const mappings = res.body[index].mappings

  if (index === 'sample') {
    const dataTypesMappings: Record<
      string,
      Record<string, string>
    > = Object.assign({}, mappings.properties.dataTypes.properties)
    mappings.properties.dataTypes.properties = { name: { type: 'keyword' } }
    for (const [key, value] of Object.entries(dataTypesMappings)) {
      if (key === 'name') {
        continue
      }
      if ('type' in value) {
        if (['text', 'keyword'].includes(value.type)) {
          mappings.properties.dataTypes.properties[key] = {
            type: value.type,
            fielddata: true,
          }
        } else {
          mappings.properties.dataTypes.properties[key] = {
            type: value.type,
          }
        }
      }
    }
  } else if (index === 'patient') {
    const dataTypesMappings: Record<
      string,
      Record<string, string>
    > = Object.assign(
      {},
      mappings.properties.samples.properties.dataTypes.properties
    )
    mappings.properties.samples.properties.dataTypes.properties = {
      name: { type: 'keyword' },
    }
    for (const [key, value] of Object.entries(dataTypesMappings)) {
      if (key === 'name') {
        continue
      }
      if ('type' in value) {
        if (['text', 'keyword'].includes(value.type)) {
          mappings.properties.samples.properties.dataTypes.properties[key] = {
            type: value.type,
            fielddata: true,
          }
        } else {
          mappings.properties.samples.properties.dataTypes.properties[key] = {
            type: value.type,
          }
        }
      }
    }
  }

  await esClient.indices.putMapping({
    index,
    body: mappings,
  })

  logStdout("Finish to update index's fielddata.")
}

export const logStdout = (message: any, expand?: boolean): void => {
  if (expand) {
    message = '\n' + JSON.stringify(message, null, '\t')
  }
  console.log(`[${dayjs().format('YYYY/MM/DD hh:mm:ss')}] ${message}`)
}

export const logStderr = (message: any, expand?: boolean): void => {
  if (expand) {
    message = '\n' + JSON.stringify(message, null, '\t')
  }
  console.error(`[${dayjs().format('YYYY/MM/DD hh:mm:ss')}] ${message}`)
}
