#!/usr/bin/env node
"use strict"
const fs = require("fs").promises
const { Client } = require("@elastic/elasticsearch")
const INDEX_MAPPINGS = {
  properties: {
    age: {
      type: "long"
    },
    dataType: {
      type: "keyword"
    },
    patientID: {
      type: "keyword"
    },
    projectID: {
      type: "keyword"
    },
    projectName: {
      type: "keyword"
    },
    sampleID: {
      type: "keyword"
    },
    samplingDate: {
      type: "date"
    },
    sex: {
      type: "keyword"
    }
  }
}
const INDEX_SETTINGS = {
  number_of_shards: 1,
  number_of_replicas: 1
}

const main = async () => {
  if (process.argv.length !== 3) {
    console.log("Please check your command.")
    console.log(
      "The json file path you want to bulk does not exist or is too long."
    )
    process.exit(1)
  }
  console.log("Start bulk to elasticsearch")
  const bulkJsonFilePath = process.argv[2]
  const client = new Client({
    node: process.env.ES_URL || "http://db:9200"
  })

  const existsIndex = await client.indices.exists({
    index: "data"
  })
  if (!existsIndex.body) {
    await client.indices.create({
      index: "data",
      body: {
        mappings: INDEX_MAPPINGS,
        settings: INDEX_SETTINGS
      }
    })
  }

  const dataBuffer = await fs.readFile(bulkJsonFilePath, "utf8")
  const data = JSON.parse(dataBuffer)
  const body = []
  for (let entry of data) {
    body.push({
      create: { _index: "data" }
    })
    body.push(entry)
  }
  await client.bulk({ refresh: true, body }, (err, res) => {
    if (res.errors) {
      console.log(err)
      console.log(JSON.stringify(res, null, 2))
    }
  })

  console.log("Finish bulk to elasticsearch")
}

if (require.main === module) {
  main()
}
