import { parseAndValidateArgs, validate } from '../../command/config'
import { ValidationError } from 'ajv'
import fs from 'fs'
import path from 'path'

const configTestFile = path.resolve(`${__dirname}/../config.test.json`)

describe('test parseAndValidateArgs', () => {
  test('ok', () => {
    const preArgv = [...process.argv]
    process.argv = [process.argv[0], process.argv[1], configTestFile]
    expect(parseAndValidateArgs()).toEqual(configTestFile)
    process.argv = [...preArgv]
  })

  test('no argument', () => {
    const preArgv = [...process.argv]
    process.argv = [process.argv[0], process.argv[1]]
    expect(() => parseAndValidateArgs()).toThrowError(Error)
    process.argv = [...preArgv]
  })

  test('does not exist', () => {
    const preArgv = [...process.argv]
    process.argv = [process.argv[0], process.argv[1], '/tmp/foobar.json']
    expect(() => parseAndValidateArgs()).toThrowError(Error)
    process.argv = [...preArgv]
  })
})

describe('test validate', () => {
  test('ok', async () => {
    const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
    expect(validate(config)).resolves.toBeUndefined()
  })

  test('error by schema', async () => {
    expect(validate({ foo: 'bar' })).rejects.toThrowError(ValidationError)
  })
})
