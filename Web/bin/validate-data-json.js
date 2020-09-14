#!/usr/bin/env node
"use strict"
// eslint-disable-next-line import/order
const Validator = require("jsonschema").Validator
const v = new Validator()

const SCHEMA_FILE_PATH = require("path").resolve(`${__dirname}/../schema.json`)
const SCHEMA_FILE = require("fs").readFileSync(SCHEMA_FILE_PATH, "utf8")
const SCHEMA = JSON.parse(SCHEMA_FILE)

const validate = async (filePaths) => {
  console.log("Start to validate the data json file.")
  const errorFileList = []
  for (const file of filePaths) {
    console.log(`Validating... ${file}`)
    const result = await require("fs")
      .promises.readFile(file, "utf8")
      .then(async (data) => await JSON.parse(data))
      .then((instance) => v.validate(instance, SCHEMA))
      .catch((error) => {
        errorFileList.push({
          file,
          error
        })
      })
    if (!result.valid) {
      errorFileList.push({
        file,
        error: result.errors
      })
    }
  }

  if (errorFileList.length === 0) {
    console.log("OK!!")
    console.log("Finish to validate the data json file.")
  } else {
    console.error("ERROR!!")
    for (const errorFile of errorFileList) {
      console.error(`Error file: ${errorFile.file}`)
      console.error(errorFile.error)
    }
    throw new Error("Validation Failed.")
  }
}

const main = async () => {
  if (process.argv.length < 3) {
    console.error("Please check your command.")
    console.error("The json file path you want to validate does not exist.")
    process.exit(1)
  }
  await validate(process.argv.slice(2)).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

if (require.main === module) {
  main()
}

module.exports = validate
