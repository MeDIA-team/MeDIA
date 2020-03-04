#!/usr/bin/env node
"use strict"
const fs = require("fs")

const PATIENT_NUM = 100
const SEX = ["Male", "Female"]
const LIBRARY_PREP = ["Kazusa", "Riken"]
const BODY_REGION = ["Back", "Thigh", "Arm", "Others"]

const readListFiles = () => {
  const projects = JSON.parse(
    fs.readFileSync("./tests/projects-list.json", "utf8")
  )
  const dataTypes = JSON.parse(
    fs.readFileSync("./tests/data-types-list.json", "utf8")
  )

  return { projects, dataTypes }
}

const generatePatients = () => {
  const patients = []
  for (let i = 0; i <= PATIENT_NUM; i++) {
    const patient = {
      id: generatePatientID(64),
      sex: randomChoice(SEX),
      birthDate: generateRandomDate(
        new Date(1920, 1, 1),
        new Date(1999, 12, 31)
      )
        .toISOString()
        .split("T")[0]
    }
    patients.push(patient)
  }

  return patients
}

const randomChoice = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const generatePatientID = (len) => {
  const maxLen = 8
  const min = Math.pow(16, Math.min(len, maxLen) - 1)
  const max = Math.pow(16, Math.min(len, maxLen)) - 1
  const n = Math.floor(Math.random() * (max - min + 1)) + min
  let r = n.toString(16)
  while (r.length < len) {
    r = r + generatePatientID(len - maxLen)
  }

  return r
}

const generateRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

const generateData = (projects, dataTypes, patients) => {
  const data = []
  for (const project of projects) {
    for (const patient of patients) {
      const sampleNum = getRandomInt(1, 3)
      for (let i = 0; i < sampleNum; i++) {
        const sample = {
          id: generatePatientID(32),
          samplingDate: generateRandomDate(
            new Date(2010, 1, 1),
            new Date(2019, 12, 31)
          )
            .toISOString()
            .split("T")[0]
        }
        const dataNum = getRandomInt(1, dataTypes.length)
        const dataTypeIndices = []
        while (dataTypeIndices.length !== dataNum) {
          const ind = getRandomInt(0, dataTypes.length - 1)
          if (!dataTypeIndices.includes(ind)) {
            dataTypeIndices.push(ind)
          }
        }
        for (const dataTypeIndex of dataTypeIndices) {
          const entry = {
            dataID: generateUUID4(),
            projectID: project.id,
            projectName: project.name,
            patientID: patient.id,
            sex: patient.sex,
            age: getAge(
              new Date(patient.birthDate),
              new Date(sample.samplingDate)
            ),
            sampleID: sample.id,
            samplingDate: new Date(sample.samplingDate),
            dataType: dataTypes[dataTypeIndex],
            filePath: `/data/${project.id}/${dataTypes[dataTypeIndex]}/${sample.id}.txt`
          }
          if (dataTypes[dataTypeIndex] === "RNAseq") {
            entry["Library Prep"] = randomChoice(LIBRARY_PREP)
          } else if (dataTypes[dataTypeIndex] === "Skin image") {
            entry["Skin image"] = randomChoice(BODY_REGION)
          }
          data.push(entry)
        }
      }
    }
  }

  return data
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

const generateUUID4 = () => {
  const chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("")
  for (let i = 0; i < chars.length; i++) {
    switch (chars[i]) {
      case "x":
        chars[i] = Math.floor(Math.random() * 16).toString(16)
        break
      case "y":
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16)
        break
    }
  }

  return chars.join("")
}

const getAge = (from, to) => {
  return Math.floor((to - from) / 1000 / 60 / 60 / 24 / 365)
}

const main = () => {
  console.log("Start generate dummy data")
  const { projects, dataTypes } = readListFiles()
  const patients = generatePatients()
  const data = generateData(projects, dataTypes, patients)
  fs.writeFileSync("./tests/dummy-data.json", JSON.stringify(data))
  console.log("Finish generate dummy data")
}

if (require.main === module) {
  main()
}
