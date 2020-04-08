#!/usr/bin/env node
"use strict"
const fs = require("fs")
const Validator = require("jsonschema").Validator
const v = new Validator()
const SCHEMA_FILE_PATH = require("path").resolve(`${__dirname}/../schema.json`)
const SCHEMA_FILE = fs.readFileSync(SCHEMA_FILE_PATH, "utf8")
const SCHEMA = JSON.parse(SCHEMA_FILE)

const validate = async (filePaths) => {
  console.log("Start to validate the data json file.")
  const errorFileList = []
  for (const file of filePaths) {
    console.log(`Validating... ${file}`)
    let data = undefined
    try {
      data = await fs.promises.readFile(file, "utf8")
    } catch (error) {
      errorFileList.push({
        file: file,
        errors: error
      })
      continue
    }
    let instance = undefined
    try {
      instance = JSON.parse(data)
    } catch (error) {
      errorFileList.push({
        file: file,
        errors: error
      })
      continue
    }
    const result = v.validate(instance, SCHEMA)
    if (result.errors.length !== 0) {
      errorFileList.push({
        file: file,
        errors: result.errors
      })
    }
  }
  if (errorFileList.length === 0) {
    console.log("OK!!")
    console.log("Finish to validate the data json file.")
  } else {
    console.error("ERROR!!")
    errorFileList.forEach((item) => {
      console.error(`Error file: ${item.file}`)
      console.error(item.errors)
    })
    throw new Error("Validate Failed.")
  }
}

const main = async () => {
  if (process.argv.length < 3) {
    console.log("Please check your command.")
    console.log("The json file path you want to validate does not exist.")
    process.exit(1)
  }
  await validate(process.argv.slice(2)).catch((err) => {
    console.error(err.name, err.message)
    process.exit(1)
  })
  process.exit(0)
}

if (require.main === module) {
  main()
}

module.exports = validate
