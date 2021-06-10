import { logStdout, logStderr } from '../../command/utils'

describe('test logStdout', () => {
  test('with string', () => {
    expect(() => logStdout('foobar')).not.toThrow()
  })

  test('with object', () => {
    expect(() => logStdout({ foo: 'bar' }, true)).not.toThrow()
  })
})

describe('test logStderr', () => {
  test('with string', () => {
    expect(() => logStderr('foobar')).not.toThrow()
  })

  test('with object', () => {
    expect(() => logStderr({ foo: 'bar' }, true)).not.toThrow()
  })
})
