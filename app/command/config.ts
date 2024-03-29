/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'fs'
import path from 'path'
import Ajv, { ValidationError } from 'ajv'

export const parseAndValidateArgs = (): string => {
  let configFilePath: string
  if (process.argv.length < 3) {
    throw new Error(
      'The config file path is required as an argument.\n    `ts-node <script> <configFilePath>`'
    )
  } else {
    configFilePath = path.resolve(process.argv[2])
  }
  if (!fs.existsSync(configFilePath)) {
    throw new Error(
      `The inputted config file path: ${configFilePath} does not exist.`
    )
  }
  return configFilePath
}

export const validate = async (config: Config): Promise<void> => {
  const schemaFilePath = path.resolve(__dirname, '../config.schema.json')
  if (!fs.existsSync(schemaFilePath)) {
    throw new Error(`Could not find schema file: ${schemaFilePath}.`)
  }
  const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf-8'))
  const ajv = new Ajv()
  const valid = await ajv.validate(schema, config)
  if (!valid) {
    if (ajv.errors) {
      throw new ValidationError(ajv.errors)
    } else {
      throw new Error('Unexpected error occurred in validation.')
    }
  }
  const filterIds = config.filter.fields.map((field) => field.id)
  if (
    !['patientId', 'sampleId', 'dataType'].every((id) => filterIds.includes(id))
  ) {
    throw new Error(
      '`.filter.fields[].id need to contain `sampleId`, `patientId` and `dataType.'
    )
  }
}

interface GeneratedSchema {
  $schema: 'http://json-schema.org/draft-07/schema#'
  type: 'array'
  additionalItems: false
  items: {
    type: 'object'
    required: string[]
    additionalProperties: boolean
    properties: Record<string | number | symbol, unknown>
  }
}

class SchemaTemplate implements GeneratedSchema {
  $schema: 'http://json-schema.org/draft-07/schema#'
  type: 'array'
  additionalItems: false
  items: {
    type: 'object'
    required: string[]
    additionalProperties: boolean
    properties: Record<string | number | symbol, unknown>
  }

  constructor() {
    this.$schema = 'http://json-schema.org/draft-07/schema#'
    this.type = 'array'
    this.additionalItems = false
    this.items = {
      type: 'object',
      required: [],
      additionalProperties: true,
      properties: {},
    }
  }
}

export const generateDataSchema = (config: Config): GeneratedSchema => {
  const dataSchema = new SchemaTemplate()
  dataSchema.items.required = config.filter.fields.map((field) => field.id)
  for (const field of config.filter.fields) {
    dataSchema.items.properties[field.id] = {
      type: field.type === 'date' ? 'string' : field.type,
    }
  }
  return dataSchema
}

export const generatePatientSchema = (config: Config): GeneratedSchema => {
  const patientSchema = new SchemaTemplate()
  patientSchema.items.required = ['patientId', 'samples']
  patientSchema.items.additionalProperties = false
  patientSchema.items.properties.patientId = { type: 'string' }
  patientSchema.items.properties.samples = {
    type: 'array',
    additionalItems: false,
    items: {
      type: 'object',
      required: [
        ...config.filter.fields
          .map((field) => field.id)
          .filter((id) => !['patientId', 'dataType'].includes(id)),
        'dataTypes',
      ],
      additionalProperties: false,
      properties: {
        sampleId: { type: 'string' },
        dataTypes: {
          type: 'array',
          additionalItems: false,
          items: {
            type: 'object',
            required: ['name'],
            additionalProperties: true,
            properties: {
              name: { type: 'string' },
            },
          },
        },
      },
    },
  }
  for (const field of config.filter.fields) {
    if (['patientId', 'sampleId', 'dataType'].includes(field.id)) {
      continue
    }
    // @ts-ignore
    patientSchema.items.properties.samples.items.properties[field.id] = {
      type: 'array',
      additionalItems: false,
      items: { type: field.type === 'date' ? 'string' : field.type },
    }
  }
  return patientSchema
}

export const generateSampleSchema = (config: Config): GeneratedSchema => {
  const sampleSchema = new SchemaTemplate()
  sampleSchema.items.required = [
    ...config.filter.fields
      .map((field) => field.id)
      .filter((id) => id !== 'dataType'),
    'dataTypes',
  ]
  sampleSchema.items.additionalProperties = false
  sampleSchema.items.properties = {
    sampleId: { type: 'string' },
    patientId: { type: 'string' },
    dataTypes: {
      type: 'array',
      additionalItems: false,
      items: {
        type: 'object',
        required: ['name'],
        additionalProperties: true,
        properties: {
          name: { type: 'string' },
        },
      },
    },
  }
  for (const field of config.filter.fields) {
    if (['patientId', 'sampleId', 'dataType'].includes(field.id)) {
      continue
    }
    sampleSchema.items.properties[field.id] = {
      type: 'array',
      additionalItems: false,
      items: { type: field.type === 'date' ? 'string' : field.type },
    }
  }
  return sampleSchema
}

export const dumpSchemas = (config: Config): void => {
  const dataSchema = generateDataSchema(config)
  const patientSchema = generatePatientSchema(config)
  const sampleSchema = generateSampleSchema(config)
  const schemaDirPath = path.resolve(__dirname, '../schema')
  if (!fs.existsSync(schemaDirPath)) {
    fs.mkdirSync(schemaDirPath)
  }
  fs.writeFileSync(
    `${schemaDirPath}/data.schema.json`,
    JSON.stringify(dataSchema, null, 2)
  )
  fs.writeFileSync(
    `${schemaDirPath}/patient.schema.json`,
    JSON.stringify(patientSchema, null, 2)
  )
  fs.writeFileSync(
    `${schemaDirPath}/sample.schema.json`,
    JSON.stringify(sampleSchema, null, 2)
  )
}

export const flattenDataTypeIds = (field: SelectorField): string[] => {
  const childIds = field.child?.flatMap((field) => flattenDataTypeIds(field))
  if (childIds) {
    return [...childIds]
  } else {
    return [field.id]
  }
}
