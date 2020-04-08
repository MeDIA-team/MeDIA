#!/usr/bin/env node
"use strict"
const fs = require("fs")
const { Client } = require("@elastic/elasticsearch")
const client = new Client({
  node: process.env.ES_URL || "http://db:9200"
})

const bulk = async (filePaths) => {
  console.log("Start bulk to elasticsearch")
  // File exists check, Validation を実行
  await require("./validate-data-json")(filePaths).catch((err) => {
    throw err
  })
  // Connection check, Create index を実行
  await require("./create-index")().catch((err) => {
    throw err
  })

  const errorFileList = []
  for (const file of filePaths) {
    console.log(`Bulking... ${file}`)
    const dataBuffer = fs.readFileSync(file, "utf8")
    const data = JSON.parse(dataBuffer)
    const body = []
    data.forEach((ele) => {
      body.push({ create: { _index: "data" } })
      body.push(ele)
    })
    await client.bulk({ refresh: true, body }).catch((err) => {
      errorFileList.push({
        file: file,
        errors: err
      })
    })
  }
  if (errorFileList.length === 0) {
    console.log("OK!!")
    console.log("Finish bulk to elasticsearch.")
  } else {
    console.error("ERROR!!")
    errorFileList.forEach((item) => {
      console.error(`Error file: ${item.file}`)
      console.error(item.errors)
    })
    throw new Error("Bulking Failed.")
  }
}

const main = async () => {
  if (process.argv.length < 3) {
    console.log("Please check your command.")
    console.log("The json file path you want to validate does not exist.")
    process.exit(1)
  }
  await bulk(process.argv.slice(2)).catch((err) => {
    console.error(err.name, err.message)
    process.exit(1)
  })
}

if (require.main === module) {
  main()
}
