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
} from './es-bulk'

const indexMappings = {
  properties: {
    sampleID: {
      type: 'keyword',
    },
    samplingDate: {
      type: 'date',
    },
    dataTypes: {
      type: 'keyword',
    },
    patientID: {
      type: 'keyword',
    },
    age: {
      type: 'short',
    },
    sex: {
      type: 'keyword',
    },
    disease: {
      type: 'keyword',
    },
    projects: {
      type: 'nested',
      properties: {
        projectID: {
          type: 'keyword',
        },
        projectName: {
          type: 'keyword',
        },
      },
    },
    projectPatientIDs: {
      type: 'keyword',
    },
  },
}

const schemaFilePath = path.resolve(
  path.dirname(__filename) + '/../es_schema/sample.json'
)

const main = async (): Promise<void> => {
  logStdout('Start Elasticsearch bulk processing...')
  try {
    const filePaths: string[] = parseArgs()
    await validateFiles(filePaths, schemaFilePath)
    const esClient: Client = generateEsClient()
    await createDataEsIndex(esClient, indexMappings)
    await bulkData(esClient, filePaths, 'sample')
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
