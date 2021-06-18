import * as utils from '~/command/utils'

describe('logStdout', () => {
  test('ok by string', () => {
    expect(() => utils.logStdout('foobar')).not.toThrow()
  })

  test('ok by object', () => {
    expect(() => utils.logStdout({ foo: 'bar' }, true)).not.toThrow()
  })
})

describe('logStderr', () => {
  test('ok by string', () => {
    expect(() => utils.logStderr('foobar')).not.toThrow()
  })

  test('ok by object', () => {
    expect(() => utils.logStderr({ foo: 'bar' }, true)).not.toThrow()
  })
})
