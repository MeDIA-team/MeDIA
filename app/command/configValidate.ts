import fs from 'fs'

import { parseAndValidateArgs, validate } from './config'
import { logStderr, logStdout } from './utils'

const main = async () => {
  logStdout('Start to validate the config.')
  try {
    const configFilePath = parseAndValidateArgs()
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
    await validate(config)
  } catch (e) {
    logStderr(e, true)
    process.exit(1)
  }
  logStdout('Finish to validate the config.')
  process.exit(0)
}

main()
