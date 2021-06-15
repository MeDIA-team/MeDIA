import fs from 'fs'
import { dumpSchemas, parseAndValidateArgs, validate } from './config'
import { logStdout } from './utils'

export const main = async () => {
  logStdout('Start to dump entry file schemas.')
  const configFilePath = parseAndValidateArgs()
  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  logStdout('Validating the config file...')
  await validate(config)
  logStdout('Dumping entry file schemas...')
  dumpSchemas(config)
  logStdout('Finish to dump entry file schemas.')
}

if (require.main === module) {
  main()
}
