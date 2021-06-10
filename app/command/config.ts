import Ajv, { ValidationError } from 'ajv'
import fs from 'fs'
import path from 'path'

export interface Config {
  filter: {
    fields: Array<CheckboxField | ChipField | TextField>
  }
  selector: {
    dataType: Array<SelectorField>
  }
}

export interface CheckboxField {
  id: string
  label: string
  form: {
    type: 'checkbox'
  }
  type: 'string'
}

export interface ChipField {
  id: string
  label: string
  form: {
    type: 'chip'
    logic: 'OR' | 'AND'
    boxWidth?: string
    boxLabel?: string
  }
  type: 'string'
}

export interface TextField {
  id: string
  label: string
  form: {
    type: 'text'
    boxWidth?: string
  }
  type: 'integer' | 'date'
}

export interface SelectorField {
  id: string
  label: string
  child?: SelectorField[]
}

export const parseAndValidateArgs = (): string => {
  let configFilePath: string
  if (process.argv.length < 3) {
    throw Error(
      'The config file path is required as an argument.\n    `ts-node <script> <configFilePath>`'
    )
  } else {
    configFilePath = path.resolve(process.argv[2])
  }
  if (!fs.existsSync(configFilePath)) {
    throw Error(
      `The inputted config file path: ${configFilePath} does not exist.`
    )
  }
  return configFilePath
}

export const validate = async (config: Record<any, any>): Promise<void> => {
  const schemeFilePath = path.resolve(`${__dirname}/../config.schema.json`)
  if (!fs.existsSync(schemeFilePath)) {
    throw Error(`Could not find schema file: ${schemeFilePath}.`)
  }
  const schema = JSON.parse(fs.readFileSync(schemeFilePath, 'utf-8'))
  const ajv = new Ajv()
  const valid = await ajv.validate(schema, config)
  if (!valid) {
    if (ajv.errors) {
      throw new ValidationError(ajv.errors)
    } else {
      throw new Error('Unexpected error occurred in validation.')
    }
  }
  const filterIds = (config as Config).filter.fields.map((field) => field.id)
  if (!(filterIds.includes('patientId') && filterIds.includes('sampleId'))) {
    throw new Error(
      '`filter.fields.[].id need to contain `sampleId` and `patientId`.'
    )
  }
}
