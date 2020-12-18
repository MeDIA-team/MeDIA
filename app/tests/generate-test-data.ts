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
  for (let i = 0; i <= patientNum; i++) {
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

const randomChoice = (arr: string[]): string => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const getAge = (from: Date, to: Date) => {
  return dayjs(to).diff(dayjs(from), 'year')
}

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
  projects: {
    projectID: string
    projectName: string
  }[]
  projectPatientIDs: string[]
  samples: {
    sampleID: string
    samplingDate: string
    dataTypes: string[]
    sex: string
    age: number
    disease: string
  }[]
}

type Sample = {
  sampleID: string
  samplingDate: string
  dataTypes: string[]
  patientID: string
  sex: string
  age: number
  disease: string
  projects: {
    projectID: string
    projectName: string
  }[]
  projectPatientIDs: string[]
}

const generateTestData = (
  patientNum: number
): { entries: Entry[]; patients: Patient[]; samples: Sample[] } => {
  const patients = generatePatients(patientNum)

  const entriesData: Entry[] = []
  const patientsData: Patient[] = []
  const samplesData: Sample[] = []

  for (const project of PROJECTS) {
    for (const patient of patients) {
      const projectPatientIDs = PROJECTS.map(
        (project) => `${project.projectID}_${patient.patientID}`
      )

      const patientData: Patient = {
        patientID: patient.patientID,
        projects: PROJECTS,
        projectPatientIDs,
        samples: [],
      }

      const sampleNum = randomInt(1, 10)
      for (let i = 0; i < sampleNum; i++) {
        const sampleId = generateRandomId(32)
        const samplingDate = generateRandomDate(
          new Date(2010, 1, 1),
          new Date(2019, 12, 31)
        )

        const dataNum = randomInt(1, DATA_TYPE.length)
        const dataTypeIndices: number[] = []
        while (dataTypeIndices.length !== dataNum) {
          const ind = randomInt(0, DATA_TYPE.length - 1)
          if (!dataTypeIndices.includes(ind)) {
            dataTypeIndices.push(ind)
          }
        }

        for (const dataTypeIndex of dataTypeIndices) {
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
            dataType: DATA_TYPE[dataTypeIndex],
            'File Path': `/data/${project.projectID}/${DATA_TYPE[dataTypeIndex]}/${sampleId}.txt`,
          }
          if (DATA_TYPE[dataTypeIndex] === 'RNAseq') {
            entry['Library Prep'] = randomChoice(LIBRARY_PREP)
          } else if (DATA_TYPE[dataTypeIndex] === 'Skin image') {
            entry['Body Region'] = randomChoice(BODY_REGION)
          }
          entriesData.push(entry)
        }

        patientData.samples.push({
          sampleID: sampleId,
          samplingDate: dayjs(samplingDate).format('YYYY-MM-DD'),
          dataTypes: dataTypeIndices.map((ind) => DATA_TYPE[ind]),
          sex: patient.sex,
          age: getAge(patient.birthDate, samplingDate),
          disease: patient.disease,
        })

        samplesData.push({
          sampleID: sampleId,
          samplingDate: dayjs(samplingDate).format('YYYY-MM-DD'),
          dataTypes: dataTypeIndices.map((ind) => DATA_TYPE[ind]),
          patientID: patient.patientID,
          sex: patient.sex,
          age: getAge(patient.birthDate, samplingDate),
          disease: patient.disease,
          projects: PROJECTS,
          projectPatientIDs,
        })
      }

      patientsData.push(patientData)
    }
  }

  return {
    entries: entriesData,
    patients: patientsData,
    samples: samplesData,
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
