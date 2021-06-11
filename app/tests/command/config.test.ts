import { ValidationError } from 'ajv'
import fs from 'fs'
import path from 'path'

import * as commandConfig from '../../command/config'

const configTestFile = path.resolve(`${__dirname}/../config.test.json`)
const dataSchemaTestFile = path.resolve(`${__dirname}/../data.schema.test.json`)
const patientSchemaTestFile = path.resolve(
  `${__dirname}/../patient.schema.test.json`
)
const sampleSchemaTestFile = path.resolve(
  `${__dirname}/../sample.schema.test.json`
)

describe('parseAndValidateArgs', () => {
  test('ok', () => {
    const preArgv = [...process.argv]
    process.argv = [process.argv[0], process.argv[1], configTestFile]
    expect(commandConfig.parseAndValidateArgs()).toEqual(configTestFile)
    process.argv = [...preArgv]
  })

  test('error due to no argument', () => {
    const preArgv = [...process.argv]
    process.argv = [process.argv[0], process.argv[1]]
    expect(() => commandConfig.parseAndValidateArgs()).toThrow()
    process.argv = [...preArgv]
  })

  test('error due to non-existence', () => {
    const preArgv = [...process.argv]
    process.argv = [process.argv[0], process.argv[1], '/tmp/foobar.json']
    expect(() => commandConfig.parseAndValidateArgs()).toThrow()
    process.argv = [...preArgv]
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
  test('ok in generating data schema', () => {
    const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
    const dataSchema = commandConfig.generateDataSchema(config)
    const expectDataSchema = JSON.parse(
      fs.readFileSync(dataSchemaTestFile, 'utf-8')
    )
    expect(dataSchema).toEqual(expectDataSchema)
  })

  test('ok in generating patient schema', () => {
    const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
    const patientSchema = commandConfig.generatePatientSchema(config)
    const expectPatientSchema = JSON.parse(
      fs.readFileSync(patientSchemaTestFile, 'utf-8')
    )
    expect(patientSchema).toEqual(expectPatientSchema)
  })

  test('ok in generating sample schema', () => {
    const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
    const sampleSchema = commandConfig.generateSampleSchema(config)
    const expectSampleSchema = JSON.parse(
      fs.readFileSync(sampleSchemaTestFile, 'utf-8')
    )
    expect(sampleSchema).toEqual(expectSampleSchema)
  })
})

describe('dumpSchemas', () => {
  const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
  expect(() => {
    commandConfig.dumpSchemas(config)
  }).not.toThrow()
  const schemaDirPath = path.resolve(`${__dirname}/../../schema`)
  expect(fs.existsSync(`${schemaDirPath}/data.schema.json`)).toBe(true)
  expect(fs.existsSync(`${schemaDirPath}/patient.schema.json`)).toBe(true)
  expect(fs.existsSync(`${schemaDirPath}/sample.schema.json`)).toBe(true)
})
