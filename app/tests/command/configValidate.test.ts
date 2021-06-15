import path from 'path'
import { main as configValidate } from '../../command/configValidate'

const configTestFile = path.resolve(`${__filename}/../../config.test.json`)

const PRE_ARGV = [...process.argv]

describe('configValidate', () => {
  afterEach(() => {
    process.argv = [...PRE_ARGV]
  })

  test('ok', async () => {
    process.argv = [PRE_ARGV[0], PRE_ARGV[1], configTestFile]
    expect(configValidate()).resolves.toBeUndefined()
  })
})
