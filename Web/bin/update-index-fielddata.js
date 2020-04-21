#!/usr/bin/env node
"use strict"
const axios = require("axios").create({
  baseURL: process.env.ES_URL || "http://db:9200",
  headers: {
    "Content-Type": "application/json"
  }
})

const requiredFields = [
  "projectID",
  "projectName",
  "patientID",
  "sex",
  "age",
  "disease",
  "sampleID",
  "samplingDate",
  "dataType"
]

const updateIndexFielddata = async () => {
  await axios.get("/").catch((err) => {
    throw err
  })

  console.log("Start to update index's fielddata.")
  const res = await axios.get("/data/_mappings").catch((err) => {
    throw err
  })
  const allFields = res.data.data.mappings.properties
  const query = {
    properties: {}
  }
  for (const field of Object.keys(allFields)) {
    if (requiredFields.includes(field)) {
      continue
    }
    if (allFields[field].type !== "text") {
      continue
    }
    query.properties[field] = {
      type: "text",
      fielddata: true
    }
  }

  if (Object.keys(query.properties).length !== 0) {
    const res = await axios
      .put("/data/_mapping", JSON.parse(JSON.stringify(query)))
      .catch((err) => {
        throw err
      })
  }

  console.log("Finish to update index's fielddata.")
}

const main = async () => {
  await updateIndexFielddata().catch((err) => {
    JSON.stringify(err, null, 2)
    process.exit(1)
  })
  process.exit(0)
}

if (require.main === module) {
  main()
}

module.exports = updateIndexFielddata
