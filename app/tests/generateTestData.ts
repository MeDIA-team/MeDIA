import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'

const SEX: string[] = ['Male', 'Female'] // NA
const LIBRARY_PREP: string[] = ['Kazusa', 'Riken']
const BODY_REGION: string[] = ['Back', 'Thigh', 'Arm', 'Others']
const RESEARCHES: { researchName: string; researchNameAbbr: string }[] = [
  {
    researchName: 'Retrospective clinical data',
    researchNameAbbr: 'RCD',
  },
  {
    researchName: 'Microbiome',
    researchNameAbbr: 'K999',
  },
  {
    researchName: 'Bleach bath',
    researchNameAbbr: 'ADc-KO99',
  },
  {
    researchName: 'Maemuki',
    researchNameAbbr: 'M999',
  },
  {
    researchName: 'Biomaker',
    researchNameAbbr: 'P999',
  },
  {
    researchName: 'Microbiome with intervention',
    researchNameAbbr: 'WWWW0000',
  },
  {
    researchName: 'Genome',
    researchNameAbbr: 'Genome0001',
  },
  {
    researchName: 'Mobile app',
    researchNameAbbr: 'A9920',
  },
  {
    researchName: 'Tight junction',
    researchNameAbbr: 'TJ111',
  },
  {
    researchName: 'NA',
    researchNameAbbr: 'NA',
  },
]
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
const Disease: string[] = [
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

const generatePatients = (patientNum: number) => {
  const patients = []
  for (let i = 0; i < patientNum; i++) {
    const sex = Math.random() <= 0.1 ? 'NA' : randomChoice(SEX)
    let diseaseRandom = Math.random()
    let disease
    let diseaseCategory
    if (diseaseRandom <= 0.4) {
      disease = 'AD'
      diseaseCategory = 'AD'
    } else if (diseaseRandom <= 0.5) {
      disease = 'NA'
      diseaseCategory = 'NA'
    } else if (diseaseRandom <= 0.7) {
      disease = 'Normal'
      diseaseCategory = 'Normal'
    } else {
      disease = randomChoice(Disease)
      diseaseCategory = 'Other'
    }
    const patient = {
      AID: generateRandomId(64),
      sex,
      birthDate: generateRandomDate(
        new Date(1920, 1, 1),
        new Date(1999, 12, 31)
      ),
      disease,
      diseaseCategory,
    }
    patients.push(patient)
  }

  return patients
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

type Research = {
  researchNameAbbr: string
  researchName: string
}

type DataType = {
  name: string
  category: string
  [K: string]: string | number
}

const defaultFields: string[] = [
  'researchNameAbbr',
  'researchName',
  'researchID',
  'AID',
  'sex',
  'age',
  'diseaseCategory',
  'disease',
  'sampleID',
  'samplingDate',
  'dataTypeCategory',
  'dataType',
]

type Entry = {
  researchNameAbbr: string
  researchName: string
  researchID: string
  AID: string
  sex: string
  age: number
  diseaseCategory: string
  disease: string
  sampleID: string
  samplingDate: string
  dataTypeCategory: string
  dataType: string
  [K: string]: string | number
}

type Patient = {
  AID: string
  researches: Research[]
  researchIDs: string[]
  samples: {
    sampleID: string
    samplingDate: string
    dataTypes: DataType[]
    sex: string
    age: number
    diseaseCategory: string
    disease: string
  }[]
}

type Sample = {
  sampleID: string
  samplingDate: string
  dataTypes: DataType[]
  AID: string
  sex: string
  age: number
  diseaseCategory: string
  disease: string
  researches: Research[]
  researchIDs: string[]
}

const mergeResearches = (researchArr: Research[], research: Research) => {
  const researchNameAbbr = researchArr.map((p) => p.researchNameAbbr)
  if (!researchNameAbbr.includes(research.researchNameAbbr)) {
    return [...researchArr, research]
  }
  return researchArr
}

const mergeStringArr = (arr: string[], val: string) => {
  if (!arr.includes(val)) {
    return [...arr, val]
  }
  return arr
}

const mergeDataType = (dataTypeArr: DataType[], entry: Entry) => {
  const dataType = entry.dataType
  const dataTypeNames = dataTypeArr.map((d) => d.name)
  if (!dataTypeNames.includes(dataType)) {
    dataTypeArr.push({
      name: entry.dataType,
      category: entry.dataTypeCategory,
    })
  }
  for (const [key, val] of Object.entries(entry)) {
    if (!defaultFields.includes(key)) {
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
    sampleID: string
    samplingDate: string
    dataTypes: DataType[]
    sex: string
    age: number
    diseaseCategory: string
    disease: string
  }[],
  entry: Entry
) => {
  const sampleID = entry.sampleID
  const sampleIDs = sampleArr.map((s) => s.sampleID)
  if (!sampleIDs.includes(sampleID)) {
    sampleArr.push({
      sampleID: entry.sampleID,
      samplingDate: entry.samplingDate,
      dataTypes: [],
      sex: entry.sex,
      age: entry.age,
      diseaseCategory: entry.diseaseCategory,
      disease: entry.disease,
    })
  }
  for (let i = 0; i < sampleArr.length; i++) {
    if (sampleArr[i].sampleID === sampleID) {
      sampleArr[i].dataTypes = mergeDataType(sampleArr[i].dataTypes, entry)
    }
  }
  return sampleArr
}

const generateTestData = (
  patientNum: number
): { entries: Entry[]; patients: Patient[]; samples: Sample[] } => {
  const entriesData: Entry[] = []
  const patients = generatePatients(patientNum)
  for (const patient of patients) {
    const researches: Research[] = []
    const researchNum = randomInt(1, 3)
    while (researches.length < researchNum) {
      const research = randomChoice(RESEARCHES)
      if (
        !researches
          .map((research) => research.researchNameAbbr)
          .includes(research.researchNameAbbr)
      ) {
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
          let dataTypeCategory
          if (
            ['Skin image', 'Microbiome', 'Cutometer', 'RNAseq'].includes(
              dataType
            )
          ) {
            dataTypeCategory = 'CategoryA'
          } else if (
            ['Medication data', 'Genome', 'Histology'].includes(dataType)
          ) {
            dataTypeCategory = 'CategoryB'
          } else {
            dataTypeCategory = 'CategoryC'
          }
          const entry: Entry = {
            researchNameAbbr: research.researchNameAbbr,
            researchName: research.researchName,
            researchID: `${research.researchNameAbbr}_${research.researchName}`,
            AID: patient.AID,
            sex: patient.sex,
            age: getAge(patient.birthDate, samplingDate),
            diseaseCategory: patient.diseaseCategory,
            disease: patient.disease,
            sampleID: sampleId,
            samplingDate: dayjs(samplingDate).format('YYYY-MM-DD'),
            dataTypeCategory,
            dataType,
            'File Path': `/data/${research.researchNameAbbr}/${dataType}/${sampleId}.txt`,
          }
          if (dataType === 'RNAseq') {
            entry['Library Prep'] = randomChoice(LIBRARY_PREP)
          } else if (dataType === 'Skin image') {
            entry['Body Region'] = randomChoice(BODY_REGION)
          }
          entriesData.push(entry)
        }
      }
    }
  }

  const samplesData: Record<string, Sample> = {}
  const patientsData: Record<string, Patient> = {}
  for (const entry of entriesData) {
    if (!(entry.sampleID in samplesData)) {
      samplesData[entry.sampleID] = {
        sampleID: entry.sampleID,
        samplingDate: entry.samplingDate,
        dataTypes: [],
        AID: entry.AID,
        sex: entry.sex,
        age: entry.age,
        diseaseCategory: entry.diseaseCategory,
        disease: entry.disease,
        researches: [],
        researchIDs: [],
      }
    }
    samplesData[entry.sampleID].dataTypes = mergeDataType(
      samplesData[entry.sampleID].dataTypes,
      entry
    )
    samplesData[entry.sampleID].researches = mergeResearches(
      samplesData[entry.sampleID].researches,
      {
        researchNameAbbr: entry.researchNameAbbr,
        researchName: entry.researchName,
      }
    )
    samplesData[entry.sampleID].researchIDs = mergeStringArr(
      samplesData[entry.sampleID].researchIDs,
      entry.researchID
    )

    if (!(entry.AID in patientsData)) {
      patientsData[entry.AID] = {
        AID: entry.AID,
        researches: [],
        researchIDs: [],
        samples: [],
      }
    }
    patientsData[entry.AID].researches = mergeResearches(
      patientsData[entry.AID].researches,
      {
        researchName: entry.researchName,
        researchNameAbbr: entry.researchNameAbbr,
      }
    )
    patientsData[entry.AID].researchIDs = mergeStringArr(
      patientsData[entry.AID].researchIDs,
      entry.researchID
    )
    patientsData[entry.AID].samples = mergeSample(
      patientsData[entry.AID].samples,
      entry
    )
  }

  return {
    entries: entriesData,
    patients: Object.values(patientsData),
    samples: Object.values(samplesData),
  }
}

const main = () => {
  console.log('Start generate test data.')
  const patientNum = parseInt(process.argv[2]) || 100
  console.log(`PatientNum: ${patientNum}`)
  const data = generateTestData(patientNum)
  const scriptDir = path.dirname(__filename)
  for (const key of ['entries', 'patients', 'samples']) {
    const filePath = path.join(scriptDir, `test-data-${key}.json`)
    const arr = data[key as 'entries' | 'patients' | 'samples']
    if (key === 'entries') {
      console.log(`Generated EntryNum: ${arr.length}`)
    } else if (key === 'patients') {
      console.log(`Generated PatientNum: ${arr.length}`)
    } else if (key === 'samples') {
      console.log(`Generated SampleNum: ${arr.length}`)
    }
    fs.writeFileSync(filePath, JSON.stringify(arr, null, 2))
    const stat = fs.statSync(filePath)
    console.log(`FileSize: ${stat.size}`)
  }
  console.log('Finish generate test data.')
}

main()
