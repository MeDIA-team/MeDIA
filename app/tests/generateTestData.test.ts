import fs from 'fs'
import path from 'path'

import { main as generateTestData } from './generateTestData'

const PRE_ARGV = [...process.argv]

describe('configDumpSchemas', () => {
  afterEach(() => {
    process.argv = [...PRE_ARGV]
  })

  test('ok', async () => {
    process.argv = [PRE_ARGV[0], PRE_ARGV[1], '1']
    expect(generateTestData()).toBeUndefined()
    const testDirPath = path.resolve(`${__dirname}`)
    expect(fs.existsSync(`${testDirPath}/data.test.json`)).toBe(true)
    expect(fs.existsSync(`${testDirPath}/patient.test.json`)).toBe(true)
    expect(fs.existsSync(`${testDirPath}/sample.test.json`)).toBe(true)
  })
})
