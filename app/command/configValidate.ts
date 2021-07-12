import fs from 'fs'

import { parseAndValidateArgs, validate } from './config'
import { logStdout } from './utils'

export const main = async (): Promise<void> => {
  logStdout('Start to validate the config file.')
  const configFilePath = parseAndValidateArgs()
  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  logStdout('Validating the config file...')
  await validate(config)
  logStdout('Finish to validate the config file.')
}

if (require.main === module) {
  main()
}
