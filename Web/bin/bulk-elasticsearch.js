#!/usr/bin/env node
"use strict"
const { Client } = require("@elastic/elasticsearch")
const client = new Client({
  node: process.env.ES_URL || "http://db:9200"
})

const bulk = async (filePaths) => {
  console.log("Start bulk to elasticsearch")
  // File exists check, Validation を実行
  await require("./validate-data-json")(filePaths)
  // Connection check, Create index を実行
  await require("./create-index")()

  const errorFileList = []
  for (const file of filePaths) {
    console.log(`Bulking... ${file}`)
    const res = await require("fs")
      .promises.readFile(file, "utf8")
      .then(async (dataBuffer) => await JSON.parse(dataBuffer))
      .then(async (data) => {
        const body = []
        data.forEach((ele) => {
          body.push({ create: { _index: "data" } })
          body.push(ele)
        })
        return await client.bulk({ refresh: true, body })
      })
      .catch((error) => {
        errorFileList.push({
          file,
          error
        })
        return false
      })

    if (typeof res !== "undefined" && res.body.errors) {
      const error = res.body.items.map((item) => {
        if (item.create.status !== 200) {
          return item.create.error
        }
      })
      errorFileList.push({
        file,
        error
      })
    }
  }

  if (errorFileList.length === 0) {
    console.log("OK!!")
    await require("./update-index-fielddata")().catch((err) => {
      throw err
    })
    console.log("Finish bulk to elasticsearch.")
  } else {
    console.error("ERROR!!")
    for (const errorFile of errorFileList) {
      console.error(`Error file: ${errorFile.file}`)
      console.error(errorFile.error)
    }
    throw new Error("Bulking Failed.")
  }
}

const main = async () => {
  if (process.argv.length < 3) {
    console.error("Please check your command.")
    console.error("The json file path you want to validate does not exist.")
    process.exit(1)
  }
  await bulk(process.argv.slice(2)).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

if (require.main === module) {
  main()
}
