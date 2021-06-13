import fs from 'fs'

import { parseAndValidateArgs, validate } from './config'
import { logStdout } from './utils'

export const main = async () => {
  logStdout('Start to validate the config.')
  const configFilePath = parseAndValidateArgs()
  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  logStdout('validating...')
  await validate(config)
  logStdout('Finish to validate the config.')
}

if (require.main === module) {
  main()
}
