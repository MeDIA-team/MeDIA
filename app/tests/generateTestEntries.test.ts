import fs from 'fs'
import path from 'path'
import { main as generateTestEntries } from '~/tests/generateTestEntries'

const PRE_ARGV = [...process.argv]

describe('configDumpSchemas', () => {
  afterEach(() => {
    process.argv = [...PRE_ARGV]
  })

  test('ok', () => {
    process.argv = [PRE_ARGV[0], PRE_ARGV[1], '1']
    expect(generateTestEntries()).toBeUndefined()
    const testDirPath = path.resolve(__dirname)
    expect(fs.existsSync(`${testDirPath}/data.test.json`)).toBeTruthy()
    expect(fs.existsSync(`${testDirPath}/patient.test.json`)).toBeTruthy()
    expect(fs.existsSync(`${testDirPath}/sample.test.json`)).toBeTruthy()
  })
})
