import fs from 'fs'

import { dumpSchemas, parseAndValidateArgs, validate } from './config'
import { logStderr, logStdout } from './utils'

export const main = async () => {
  logStdout('Start to dump schemas.')
  try {
    const configFilePath = parseAndValidateArgs()
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
    logStdout('validating...')
    await validate(config)
    logStdout('dumping...')
    dumpSchemas(config)
  } catch (e) {
    logStderr(e, true)
    process.exit(1)
  }
  logStdout('Finish to dump schemas.')
  process.exit(0)
}

main()
