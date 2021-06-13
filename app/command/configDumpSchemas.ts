import fs from 'fs'

import { dumpSchemas, parseAndValidateArgs, validate } from './config'
import { logStdout } from './utils'

export const main = async () => {
  logStdout('Start to dump schemas.')
  const configFilePath = parseAndValidateArgs()
  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  logStdout('validating...')
  await validate(config)
  logStdout('dumping...')
  dumpSchemas(config)
  logStdout('Finish to dump schemas.')
}

if (require.main === module) {
  main()
}
