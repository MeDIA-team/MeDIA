import path from 'path'
import { main as esBulkValidate } from '../../command/esBulkValidate'
import { main as generateTestEntries } from '../generateTestEntries'

const configTestFile = path.resolve(`${__filename}/../../config.test.json`)

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

    test(`ok in the case of ${entryFileType}`, async () => {
      const entryFilePath = path.resolve(
        `${__filename}/../../${entryFileType}.test.json`
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
