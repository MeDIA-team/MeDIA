#!/usr/bin/env node
"use strict"
const fs = require("fs")
const Validator = require("jsonschema").Validator
const v = new Validator()
const SCHEMA_FILE_PATH = require("path").resolve(__dirname + "/../schema.json")

const main = () => {
  if (process.argv.length !== 3) {
    console.log("Please check your command.")
    console.log(
      "The json file path you want to validate does not exist or is too long."
    )
    process.exit(1)
  }
  console.log("Start to validate the data json file.")
  const dataJsonFilePath = process.argv[2]
  const instance = JSON.parse(fs.readFileSync(dataJsonFilePath, "utf8"))
  const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE_PATH, "utf8"))
  const result = v.validate(instance, schema)
  if (result.errors.length === 0) {
    console.log("OK!!")
  } else {
    console.log("ERROR!!")
    console.log(result.errors)
  }
  console.log("Finish to validate the data json file.")
}

if (require.main === module) {
  main()
}