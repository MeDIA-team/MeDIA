import fs from 'fs'
import path from 'path'
import { main as configDumpSchemas } from '~/command/configDumpSchemas'

const configTestFile = path.resolve(__dirname, '../config.test.json')

const PRE_ARGV = [...process.argv]

describe('configDumpSchemas', () => {
  afterEach(() => {
    process.argv = [...PRE_ARGV]
  })

  test('ok', () => {
    process.argv = [PRE_ARGV[0], PRE_ARGV[1], configTestFile]
    expect(configDumpSchemas()).resolves.toBeUndefined()
    const schemaDirPath = path.resolve(__dirname, '../../schema')
    expect(fs.existsSync(`${schemaDirPath}/data.schema.json`)).toBeTruthy()
    expect(fs.existsSync(`${schemaDirPath}/patient.schema.json`)).toBeTruthy()
    expect(fs.existsSync(`${schemaDirPath}/sample.schema.json`)).toBeTruthy()
  })
})
