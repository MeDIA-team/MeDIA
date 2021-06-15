import fs from 'fs'
import path from 'path'
import { dumpSchemas } from '../../command/config'
import {
  EntryFileType,
  esMappings,
  parseAndValidateArgs,
  validateEntryFile,
} from '../../command/esBulk'
import { main as generateTestData } from '../generateTestData'

const configTestFile = path.resolve(`${__filename}/../../config.test.json`)

const PRE_ARGV = [...process.argv]

describe.each(['data', 'patient', 'sample'])(
  'parseAndValidateArgs',
  (entryFileType) => {
    beforeAll(() => {
      process.argv = [PRE_ARGV[0], PRE_ARGV[1], '1']
      generateTestData()
    })

    afterEach(() => {
      process.argv = [...PRE_ARGV]
    })

    test(`ok in the case of ${entryFileType}`, () => {
      const entryFilePath = path.resolve(
        `${__filename}/../../${entryFileType}.test.json`
      )
      process.argv = [
        PRE_ARGV[0],
        PRE_ARGV[1],
        entryFileType,
        configTestFile,
        entryFilePath,
      ]
      expect(parseAndValidateArgs()).toEqual([
        entryFileType,
        configTestFile,
        entryFilePath,
      ])
    })
  }
)

describe.each(['data', 'patient', 'sample'])(
  'validateEntryFile',
  (entryFileType) => {
    beforeAll(() => {
      process.argv = [PRE_ARGV[0], PRE_ARGV[1], '1']
      generateTestData()
      const config = JSON.parse(fs.readFileSync(configTestFile, 'utf-8'))
      dumpSchemas(config)
    })

    afterEach(() => {
      process.argv = [...PRE_ARGV]
    })

    test(`ok in the case of ${entryFileType}`, async () => {
      const entryFilePath = path.resolve(
        `${__filename}/../../${entryFileType}.test.json`
      )
      expect(
        validateEntryFile(
          entryFileType as EntryFileType,
          configTestFile,
          entryFilePath
        )
      ).resolves.toBeUndefined()
    })
  }
)

const EXPECTED_ES_SCHEMAS = {
  data: {
    properties: {
      research: {
        type: 'keyword',
      },
      patientId: {
        type: 'keyword',
      },
      researchId: {
        type: 'keyword',
      },
      sex: {
        type: 'keyword',
      },
      age: {
        type: 'integer',
      },
      diseaseCategory: {
        type: 'keyword',
      },
      disease: {
        type: 'keyword',
      },
      sampleId: {
        type: 'keyword',
      },
      samplingDate: {
        type: 'date',
      },
      dataType: {
        type: 'keyword',
      },
    },
  },
  patient: {
    properties: {
      samples: {
        type: 'nested',
        properties: {
          research: {
            type: 'keyword',
          },
          researchId: {
            type: 'keyword',
          },
          sex: {
            type: 'keyword',
          },
          age: {
            type: 'integer',
          },
          diseaseCategory: {
            type: 'keyword',
          },
          disease: {
            type: 'keyword',
          },
          sampleId: {
            type: 'keyword',
          },
          samplingDate: {
            type: 'date',
          },
          dataTypes: {
            type: 'nested',
            properties: {
              name: {
                type: 'keyword',
              },
            },
          },
        },
      },
      patientId: {
        type: 'keyword',
      },
    },
  },
  sample: {
    properties: {
      research: {
        type: 'keyword',
      },
      patientId: {
        type: 'keyword',
      },
      researchId: {
        type: 'keyword',
      },
      sex: {
        type: 'keyword',
      },
      age: {
        type: 'integer',
      },
      diseaseCategory: {
        type: 'keyword',
      },
      disease: {
        type: 'keyword',
      },
      sampleId: {
        type: 'keyword',
      },
      samplingDate: {
        type: 'date',
      },
      dataTypes: {
        type: 'nested',
        properties: {
          name: {
            type: 'keyword',
          },
        },
      },
    },
  },
}

describe.each(['data', 'patient', 'sample'])('esMappings', (entryFileType) => {
  test(`ok in the case of ${entryFileType}`, () => {
    expect(esMappings(entryFileType as EntryFileType, configTestFile)).toEqual(
      EXPECTED_ES_SCHEMAS[entryFileType as EntryFileType]
    )
  })
})
