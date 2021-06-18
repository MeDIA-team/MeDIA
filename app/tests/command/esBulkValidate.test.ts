import path from 'path'
import { main as generateTestEntries } from '~/tests/generateTestEntries'
import { main as esBulkValidate } from '~/command/esBulkValidate'

const configTestFile = path.resolve(__dirname, '../config.test.json')

const PRE_ARGV = [...process.argv]

describe.each(['data', 'patient', 'sample'])(
  'configValidate',
  (entryFileType) => {
    beforeAll(() => {
      process.argv = [PRE_ARGV[0], PRE_ARGV[1], '1']
      generateTestEntries()
    })

    afterEach(() => {
      process.argv = [...PRE_ARGV]
    })

    test(`ok in the case of ${entryFileType}`, () => {
      const entryFilePath = path.resolve(
        __dirname,
        `../${entryFileType}.test.json`
      )
      process.argv = [
        PRE_ARGV[0],
        PRE_ARGV[1],
        entryFileType,
        configTestFile,
        entryFilePath,
      ]
      expect(esBulkValidate()).resolves.toBeUndefined()
    })
  }
)
