import fs from 'fs'

import {
  dumpSchemas as configDumpSchemas,
  validate as configValidate,
} from './config'
import { parseAndValidateArgs, validateEntryFile } from './esBulk'
import { logStdout } from './utils'

export const main = async (): Promise<void> => {
  logStdout('Start to validate the entry file.')
  const [entryFileType, configFilePath, entryFilePath] = parseAndValidateArgs()
  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
  logStdout('Validating the config file...')
  await configValidate(config)
  logStdout('Dumping entry file schemas...')
  configDumpSchemas(config)
  logStdout('Validating the entry file...')
  await validateEntryFile(entryFileType, configFilePath, entryFilePath)
  logStdout('Finish to validate the entry file.')
}

if (require.main === module) {
  main()
}
