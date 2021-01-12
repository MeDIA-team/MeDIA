import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'

const SEX: string[] = ['Male', 'Female']
const LIBRARY_PREP: string[] = ['Kazusa', 'Riken']
const BODY_REGION: string[] = ['Back', 'Thigh', 'Arm', 'Others']
const PROJECTS: { projectName: string; projectID: string }[] = [
  {
    projectName: 'Retrospective clinical data',
    projectID: 'RCD',
  },
  {
    projectName: 'Microbiome',
    projectID: 'K999',
  },
  {
    projectName: 'Bleach bath',
    projectID: 'ADc-KO99',
  },
  {
    projectName: 'Maemuki',
    projectID: 'M999',
  },
  {
    projectName: 'Biomaker',
    projectID: 'P999',
  },
  {
    projectName: 'Microbiome with intervention',
    projectID: 'WWWW0000',
  },
  {
    projectName: 'Genome',
    projectID: 'Genome0001',
  },
  {
    projectName: 'Mobile app',
    projectID: 'A9920',
  },
  {
    projectName: 'Tight junction',
    projectID: 'TJ111',
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
    const patient = {
      patientID: generateRandomId(64),
      sex: randomChoice(SEX),
      birthDate: generateRandomDate(
        new Date(1920, 1, 1),
        new Date(1999, 12, 31)
      ),
      disease: `Disease ${randomChoice(['A', 'B', 'C', 'D', 'E'])}`,
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

type Project = {
  projectID: string
  projectName: string
}

type DataType = {
  name: string
  [K: string]: string | number
}

const defaultFields: string[] = [
  'projectID',
  'projectName',
  'projectPatientID',
  'patientID',
  'sex',
  'age',
  'disease',
  'sampleID',
  'samplingDate',
  'dataType',
]

type Entry = {
  projectID: string
  projectName: string
  projectPatientID: string
  patientID: string
  sex: string
  age: number
  disease: string
  sampleID: string
  samplingDate: string
  dataType: string
  [K: string]: string | number
}

type Patient = {
  patientID: string
  projects: Project[]
  projectPatientIDs: string[]
  samples: {
    sampleID: string
    samplingDate: string
    dataTypes: DataType[]
    sex: string
    age: number
    disease: string
  }[]
}

type Sample = {
  sampleID: string
  samplingDate: string
  dataTypes: DataType[]
  patientID: string
  sex: string
  age: number
  disease: string
  projects: Project[]
  projectPatientIDs: string[]
}

const mergeProject = (projectArr: Project[], project: Project) => {
  const projectNames = projectArr.map((p) => p.projectID)
  if (!projectNames.includes(project.projectID)) {
    return [...projectArr, project]
  }
  return projectArr
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
    dataTypeArr.push({ name: dataType })
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
    const projects: Project[] = []
    const projectNum = randomInt(1, PROJECTS.length)
    while (projects.length < projectNum) {
      const project = randomChoice(PROJECTS)
      if (
        !projects
          .map((project) => project.projectID)
          .includes(project.projectID)
      ) {
        projects.push(project)
      }
    }
    for (const project of projects) {
      const sampleNum = randomInt(1, 5)
      for (let i = 0; i < sampleNum; i++) {
        const sampleId = generateRandomId(32)
        const samplingDate = generateRandomDate(
          new Date(2010, 1, 1),
          new Date(2019, 12, 31)
        )

        const dataTypes: string[] = []
        const dataNum = randomInt(1, DATA_TYPE.length)
        while (dataTypes.length < dataNum) {
          const dataType = randomChoice(DATA_TYPE)
          if (!dataTypes.includes(dataType)) {
            dataTypes.push(dataType)
          }
        }
        for (const dataType of dataTypes) {
          const entry: Entry = {
            projectID: project.projectID,
            projectName: project.projectName,
            projectPatientID: `${project.projectID}_${patient.patientID}`,
            patientID: patient.patientID,
            sex: patient.sex,
            age: getAge(patient.birthDate, samplingDate),
            disease: patient.disease,
            sampleID: sampleId,
            samplingDate: dayjs(samplingDate).format('YYYY-MM-DD'),
            dataType,
            'File Path': `/data/${project.projectID}/${dataType}/${sampleId}.txt`,
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
        patientID: entry.patientID,
        sex: entry.sex,
        age: entry.age,
        disease: entry.disease,
        projects: [],
        projectPatientIDs: [],
      }
    }
    samplesData[entry.sampleID].dataTypes = mergeDataType(
      samplesData[entry.sampleID].dataTypes,
      entry
    )
    samplesData[entry.sampleID].projects = mergeProject(
      samplesData[entry.sampleID].projects,
      { projectName: entry.projectName, projectID: entry.projectID }
    )
    samplesData[entry.sampleID].projectPatientIDs = mergeStringArr(
      samplesData[entry.sampleID].projectPatientIDs,
      entry.projectPatientID
    )

    if (!(entry.patientID in patientsData)) {
      patientsData[entry.patientID] = {
        patientID: entry.patientID,
        projects: [],
        projectPatientIDs: [],
        samples: [],
      }
    }
    patientsData[entry.patientID].projects = mergeProject(
      patientsData[entry.patientID].projects,
      { projectName: entry.projectName, projectID: entry.projectID }
    )
    patientsData[entry.patientID].projectPatientIDs = mergeStringArr(
      patientsData[entry.patientID].projectPatientIDs,
      entry.projectPatientID
    )
    patientsData[entry.patientID].samples = mergeSample(
      patientsData[entry.patientID].samples,
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
  const data = generateTestData(100)
  const scriptDir = path.dirname(__filename)
  for (const key of ['entries', 'patients', 'samples']) {
    for (let i = 1; i < 3; i++) {
      const filePath = path.join(scriptDir, `test-data-${key}-${i}.json`)
      const arr = data[key as 'entries' | 'patients' | 'samples']
      const start = i === 1 ? 0 : Math.floor(arr.length / 2)
      const end = i === 1 ? Math.floor(arr.length / 2) : arr.length + 1
      fs.writeFileSync(filePath, JSON.stringify(arr.slice(start, end), null, 2))
    }
  }
  console.log('Finish generate test data.')
}

main()
