import path from 'path'
import { Client } from '@elastic/elasticsearch'
import {
  parseArgs,
  generateEsClient,
  validateFiles,
  createDataEsIndex,
  bulkData,
  logStdout,
  logStderr,
  ValidationError,
} from './esBulk'

const indexMappings = {
  properties: {
    age: {
      type: 'short',
    },
    dataType: {
      type: 'keyword',
    },
    projectPatientID: {
      type: 'keyword',
    },
    patientID: {
      type: 'keyword',
    },
    projectID: {
      type: 'keyword',
    },
    projectName: {
      type: 'keyword',
    },
    sampleID: {
      type: 'keyword',
    },
    samplingDate: {
      type: 'date',
    },
    sex: {
      type: 'keyword',
    },
    disease: {
      type: 'keyword',
    },
  },
}

const schemaFilePath = path.resolve(
  path.dirname(__filename) + '/../es_schema/entry.json'
)

const main = async (): Promise<void> => {
  logStdout('Start Elasticsearch bulk processing...')
  try {
    const filePaths: string[] = parseArgs()
    await validateFiles(filePaths, schemaFilePath)
    const esClient: Client = generateEsClient()
    await createDataEsIndex(esClient, indexMappings, 'entry')
    await bulkData(esClient, filePaths, 'entry')
  } catch (e) {
    if (e instanceof ValidationError) {
      logStderr(e.originalError)
      logStderr(`Error file: ${e.filePath}`)
      logStderr(e.errors, true)
    } else {
      logStderr(e, true)
    }
  }
  logStdout('Finish Elasticsearch bulk processing...')
}

main()
