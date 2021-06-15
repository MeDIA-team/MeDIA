import { ValidationError } from 'ajv'
import fs from 'fs'
import path from 'path'
import * as commandConfig from '../../command/config'

const configTestFile = path.resolve(`${__filename}/../../config.test.json`)
const dataSchemaTestFile = path.resolve(
  `${__filename}/../../data.schema.test.json`
)
const patientSchemaTestFile = path.resolve(
  `${__filename}/../../patient.schema.test.json`
)
const sampleSchemaTestFile = path.resolve(
  `${__filename}/../../sample.schema.test.json`
)

const PRE_ARGV = [...process.argv]

describe('parseAndValidateArgs', () => {
  afterEach(() => {
    process.argv = [...PRE_ARGV]
  })

  test('ok', () => {
    process.argv = [PRE_ARGV[0], PRE_ARGV[1], configTestFile]
    expect(commandConfig.parseAndValidateArgs()).toEqual(configTestFile)
  })

  test('error due to no argument', () => {
    process.argv = [PRE_ARGV[0], PRE_ARGV[1]]
    expect(() => commandConfig.parseAndValidateArgs()).toThrow()
  })

  test('error due to non-existence', () => {
    process.argv = [PRE_ARGV[0], PRE_ARGV[1], '/tmp/foobar.json']
    expect(() => commandConfig.parseAndValidateArgs()).toThrow()
  })
})

describe('validate', () => {
  test('ok', () => {
    const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
    expect(commandConfig.validate(config)).resolves.toBeUndefined()
  })

  test('error by schema', () => {
    expect(commandConfig.validate({ foo: 'bar' })).rejects.toThrowError(
      ValidationError
    )
  })
})

describe('generateSchema', () => {
  test('ok in generating the data schema', () => {
    const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
    const dataSchema = commandConfig.generateDataSchema(config)
    const expectDataSchema = JSON.parse(
      fs.readFileSync(dataSchemaTestFile, 'utf-8')
    )
    expect(dataSchema).toEqual(expectDataSchema)
  })

  test('ok in generating the patient schema', () => {
    const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
    const patientSchema = commandConfig.generatePatientSchema(config)
    const expectPatientSchema = JSON.parse(
      fs.readFileSync(patientSchemaTestFile, 'utf-8')
    )
    expect(patientSchema).toEqual(expectPatientSchema)
  })

  test('ok in generating the sample schema', () => {
    const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
    const sampleSchema = commandConfig.generateSampleSchema(config)
    const expectSampleSchema = JSON.parse(
      fs.readFileSync(sampleSchemaTestFile, 'utf-8')
    )
    expect(sampleSchema).toEqual(expectSampleSchema)
  })
})

describe('dumpSchemas', () => {
  test('ok', () => {
    const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
    expect(() => {
      commandConfig.dumpSchemas(config)
    }).not.toThrow()
    const schemaDirPath = path.resolve(`${__filename}/../../../schema`)
    expect(fs.existsSync(`${schemaDirPath}/data.schema.json`)).toBe(true)
    expect(fs.existsSync(`${schemaDirPath}/patient.schema.json`)).toBe(true)
    expect(fs.existsSync(`${schemaDirPath}/sample.schema.json`)).toBe(true)
  })
})

describe('dataTypeIds', () => {
  test('ok', () => {
    const config: commandConfig.Config = JSON.parse(
      fs.readFileSync(configTestFile, 'utf-8')
    )
    const dataTypeIds = config.selector.dataType.flatMap((field) =>
      commandConfig.flattenDataTypeIds(field)
    )
    dataTypeIds.sort()
    const expectDataTypeIds = [
      'skinImage',
      'microbiome',
      'cutometer',
      'RNAseq',
      'medicationData',
      'genome',
      'histology',
      'clinicalLabData',
      'cytokine',
      'nerveImaging',
    ]
    expectDataTypeIds.sort()
    expect(dataTypeIds).toEqual(expectDataTypeIds)
  })
})
