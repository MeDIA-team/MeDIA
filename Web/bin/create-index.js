#!/usr/bin/env node
"use strict"
const axios = require("axios").create({
  baseURL: process.env.ES_URL || "http://db:9200",
  headers: {
    "Content-Type": "application/json"
  }
})

const INDEX_MAPPINGS = {
  properties: {
    age: {
      type: "long"
    },
    dataType: {
      type: "keyword"
    },
    projectPatientID: {
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
    },
    disease: {
      type: "keyword"
    }
  }
}
const INDEX_SETTINGS = {
  number_of_shards: 1,
  number_of_replicas: 1,
  "index.max_result_window": 10000000
}

const createIndex = async () => {
  await axios.get("/").catch((err) => {
    throw err
  })

  let existsIndex = true
  await axios.get("/data").catch(() => {
    existsIndex = false
  })
  if (!existsIndex) {
    console.log("Start to create ES index.")
    await axios
      .put("/data", {
        mappings: INDEX_MAPPINGS,
        settings: INDEX_SETTINGS
      })
      .catch((err) => {
        throw err
      })
    console.log("Finish to create ES index.")
  } else {
    console.log("Index already exists.")
  }
}

const main = async () => {
  await createIndex().catch((err) => {
    JSON.stringify(err, null, 2)
    process.exit(1)
  })
  process.exit(0)
}

if (require.main === module) {
  main()
}

module.exports = createIndex
