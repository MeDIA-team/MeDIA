import dayjs from 'dayjs'
import fs from 'fs'
import path from 'path'

import { logStdout } from '../command/utils'

const RESEARCHES: string[] = [
  'Retrospective clinical data',
  'Microbiome',
  'Bleach bath',
  'Maemuki',
  'Biomaker',
  'Microbiome with intervention',
  'Genome',
  'Mobile app',
  'Tight junction',
] // NA
const SEX: string[] = ['Male', 'Female'] // NA
const DISEASE: string[] = [
  'Basal_cell_carcinoma',
  'Chronic_granulomatous_disease',
  'Dermatomyositis',
  'Dystrophic_Epidermolysis_bullosa_pruriginosa',
  'Epidermolysis_bullosa_acquisita',
  'Hypereosinophilic_syndrome',
  'IdA_pemphigus',
  'acne',
  'chronic_eczema',
  'confluent_and_reticulated_papillomatosis',
  'insect_bite',
  'lymphedema_associated_neutrophilic_disease',
  'pemphigus_foliaceus',
  'pemphigus_vulgaris',
  'prurigo',
  'prurigo_nodularis',
  'psoriasis_vulgaris',
  'seborrheic_dermatitis',
  'seborrheic_dermatitis',
] // AD, NA, Normal
const DATA_TYPE: string[] = [
  'Skin image',
  'Microbiome',
  'Cutometer',
  'RNAseq',
  'Medication data',
  'Genome',
  'Histology',
  'Clinical lab data',
  'Cytokine',
  'Nerve imaging',
]
const LIBRARY_PREP: string[] = ['Kazusa', 'Riken']
const BODY_REGION: string[] = ['Back', 'Thigh', 'Arm', 'Others']

const DEFAULT_FIELDS: string[] = [
  'research',
  'patientId',
  'researchId',
  'sex',
  'age',
  'diseaseCategory',
  'disease',
  'sampleId',
  'samplingDate',
  'dataType',
]

interface DataType {
  name: string
  [k: string]: unknown
}

interface Data {
  research: string
  patientId: string
  researchId: string
  sex: string
  age: number
  diseaseCategory: string
  disease: string
  sampleId: string
  samplingDate: string
  dataType: string
  [k: string]: unknown
}

interface Patient {
  patientId: string
  samples: {
    sampleId: string
    research: string[]
    researchId: string[]
    sex: string[]
    age: number[]
    diseaseCategory: string[]
    disease: string[]
    samplingDate: string[]
    dataTypes: DataType[]
  }[]
}

interface Sample {
  sampleId: string
  patientId: string
  research: string[]
  researchId: string[]
  sex: string[]
  age: number[]
  diseaseCategory: string[]
  disease: string[]
  samplingDate: string[]
  dataTypes: DataType[]
}

const generateRandomId = (len: number): string => {
  const maxLen = 8
  const min = 16 ** (Math.min(len, maxLen) - 1)
  const max = 16 ** Math.min(len, maxLen) - 1
  const n = Math.floor(Math.random() * (max - min + 1)) + min
  let r = n.toString(16)
  while (r.length < len) {
    r = r + generateRandomId(len - maxLen)
  }

  return r
}

const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

const randomChoice = <T>(arr: Array<T>): T => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const getAge = (from: Date, to: Date) => {
  return dayjs(to).diff(dayjs(from), 'year')
}

const generateDiseaseAndCategory = () => {
  const random = Math.random()
  if (random <= 0.4) {
    return { disease: 'AD', diseaseCategory: 'AD' }
  } else if (random <= 0.5) {
    return { disease: 'NA', diseaseCategory: 'NA' }
  } else if (random <= 0.7) {
    return { disease: 'Normal', diseaseCategory: 'Normal' }
  } else {
    return { disease: randomChoice(DISEASE), diseaseCategory: 'Other' }
  }
}

const generatePatients = (patientNum: number) => {
  const patients = []
  for (let i = 0; i < patientNum; i++) {
    const diseaseAndCategory = generateDiseaseAndCategory()
    const patient = {
      patientId: generateRandomId(64),
      sex: Math.random() <= 0.1 ? 'NA' : randomChoice(SEX),
      birthDate: generateRandomDate(
        new Date(1920, 1, 1),
        new Date(1999, 12, 31)
      ),
      disease: diseaseAndCategory.disease,
      diseaseCategory: diseaseAndCategory.diseaseCategory,
    }
    patients.push(patient)
  }

  return patients
}

const mergeDataType = (dataTypeArr: DataType[], data: Data) => {
  const dataType = data.dataType
  const dataTypeNames = dataTypeArr.map((d) => d.name)
  if (!dataTypeNames.includes(dataType)) {
    dataTypeArr.push({
      name: data.dataType,
    })
  }
  for (const [key, val] of Object.entries(data)) {
    if (!DEFAULT_FIELDS.includes(key)) {
      for (let i = 0; i < dataTypeArr.length; i++) {
        if (dataType === dataTypeArr[i].name) {
          dataTypeArr[i][key] = val
        }
      }
    }
  }
  return dataTypeArr
}

const mergeSample = (
  sampleArr: {
    sampleId: string
    research: string[]
    researchId: string[]
    sex: string[]
    age: number[]
    diseaseCategory: string[]
    disease: string[]
    samplingDate: string[]
    dataTypes: DataType[]
  }[],
  data: Data
) => {
  const sampleId = data.sampleId
  const sampleIds = sampleArr.map((s) => s.sampleId)
  if (!sampleIds.includes(sampleId)) {
    sampleArr.push({
      sampleId: data.sampleId,
      research: [] as string[],
      researchId: [] as string[],
      sex: [] as string[],
      age: [] as number[],
      diseaseCategory: [] as string[],
      disease: [] as string[],
      samplingDate: [] as string[],
      dataTypes: [] as DataType[],
    })
  }
  for (let i = 0; i < sampleArr.length; i++) {
    if (sampleArr[i].sampleId === sampleId) {
      for (const key of Object.keys(sampleArr[i]) as (keyof Sample)[]) {
        if (key === 'sampleId' || key === 'patientId') {
          continue
        } else if (key === 'dataTypes') {
          sampleArr[i].dataTypes = mergeDataType(sampleArr[i].dataTypes, data)
        } else {
          // @ts-ignore
          sampleArr[i][key] = Array.from(
            new Set([...sampleArr[i][key], data[key]])
          )
        }
      }
    }
  }
  return sampleArr
}

const generateTestData = (
  patientNum: number
): { data: Data[]; patient: Patient[]; sample: Sample[] } => {
  const patients = generatePatients(patientNum)
  const dataArr: Data[] = []
  for (const patient of patients) {
    const researches: string[] = []
    const researchNum = randomInt(1, 3)
    while (researches.length < researchNum) {
      const research = randomChoice(RESEARCHES)
      if (!researches.includes(research)) {
        researches.push(research)
      }
    }
    for (const research of researches) {
      const sampleNum = randomInt(1, 5)
      for (let i = 0; i < sampleNum; i++) {
        const sampleId = generateRandomId(32)
        const samplingDate = generateRandomDate(
          new Date(2010, 1, 1),
          new Date(2019, 12, 31)
        )
        const dataTypes: string[] = []
        const dataNum = randomInt(1, 5)
        while (dataTypes.length < dataNum) {
          const dataType = randomChoice(DATA_TYPE)
          if (!dataTypes.includes(dataType)) {
            dataTypes.push(dataType)
          }
        }
        for (const dataType of dataTypes) {
          const data: Data = {
            research,
            patientId: patient.patientId,
            researchId: `${research}_${patient.patientId}`,
            sex: patient.sex,
            age: getAge(patient.birthDate, samplingDate),
            diseaseCategory: patient.diseaseCategory,
            disease: patient.disease,
            sampleId,
            samplingDate: dayjs(samplingDate).format('YYYY-MM-DD'),
            dataType,
            'File Path': `/data/${research}/${dataType}/${sampleId}.txt`,
          }
          if (dataType === 'RNAseq') {
            data['Library Prep'] = randomChoice(LIBRARY_PREP)
          } else if (dataType === 'Skin image') {
            data['Body Region'] = randomChoice(BODY_REGION)
          }
          dataArr.push(data)
        }
      }
    }
  }
  const patientData: Record<string, Patient> = {}
  const sampleData: Record<string, Sample> = {}
  for (const data of dataArr) {
    if (!(data.sampleId in sampleData)) {
      sampleData[data.sampleId] = {
        sampleId: data.sampleId,
        patientId: data.patientId,
        research: [] as string[],
        researchId: [] as string[],
        sex: [] as string[],
        age: [] as number[],
        diseaseCategory: [] as string[],
        disease: [] as string[],
        samplingDate: [] as string[],
        dataTypes: [] as DataType[],
      }
    }
    for (const key of Object.keys(
      sampleData[data.sampleId]
    ) as (keyof Sample)[]) {
      if (key === 'sampleId' || key === 'patientId') {
        continue
      } else if (key === 'dataTypes') {
        sampleData[data.sampleId].dataTypes = mergeDataType(
          sampleData[data.sampleId].dataTypes,
          data
        )
      } else {
        // @ts-ignore
        sampleData[data.sampleId][key] = Array.from(
          new Set([...sampleData[data.sampleId][key], data[key]])
        )
      }
    }

    if (!(data.patientId in patientData)) {
      patientData[data.patientId] = {
        patientId: data.patientId,
        samples: [],
      }
    }
    patientData[data.patientId].samples = mergeSample(
      patientData[data.patientId].samples,
      data
    )
  }

  return {
    data: dataArr,
    patient: Object.values(patientData),
    sample: Object.values(sampleData),
  }
}

export const main = () => {
  logStdout('Start to generate the test data.')
  const patientNum = parseInt(process.argv[2]) || 100
  logStdout(`PatientNum: ${patientNum}`)
  const data = generateTestData(patientNum)
  const testDirPath = path.resolve(__dirname)
  for (const key of ['data', 'patient', 'sample']) {
    const filePath = path.join(testDirPath, `${key}.test.json`)
    const arr = data[key as 'data' | 'patient' | 'sample']
    if (key === 'data') {
      console.log(`Generated DataNum: ${arr.length}`)
    } else if (key === 'patient') {
      console.log(`Generated PatientNum: ${arr.length}`)
    } else if (key === 'sample') {
      console.log(`Generated SampleNum: ${arr.length}`)
    }
    fs.writeFileSync(filePath, JSON.stringify(arr, null, 2))
    const stat = fs.statSync(filePath)
    console.log(`FileSize: ${stat.size}`)
  }
  logStdout('Finish to generate the test data.')
}

if (require.main === module) {
  main()
}
