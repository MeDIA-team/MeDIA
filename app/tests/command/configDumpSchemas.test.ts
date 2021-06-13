import fs from 'fs'
import path from 'path'

import { main as configDumpSchemas } from '../../command/configDumpSchemas'

const configTestFile = path.resolve(`${__filename}/../../config.test.json`)

const PRE_ARGV = [...process.argv]

describe('configDumpSchemas', () => {
  afterEach(() => {
    process.argv = [...PRE_ARGV]
  })

  test('ok', async () => {
    process.argv = [PRE_ARGV[0], PRE_ARGV[1], configTestFile]
    expect(configDumpSchemas()).resolves.toBeUndefined()
    const schemaDirPath = path.resolve(`${__filename}/../../../schema`)
    expect(fs.existsSync(`${schemaDirPath}/data.schema.json`)).toBe(true)
    expect(fs.existsSync(`${schemaDirPath}/patient.schema.json`)).toBe(true)
    expect(fs.existsSync(`${schemaDirPath}/sample.schema.json`)).toBe(true)
  })
})
