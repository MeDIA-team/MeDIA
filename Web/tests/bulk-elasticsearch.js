#!/usr/bin/env node
"use strict"
const fs = require("fs")
const { Client } = require("@elastic/elasticsearch")
const client = new Client({
  node: "http://db:9200"
})

const DUMMY_DATA_PATH = "./tests/dummy-data.json"

const main = async () => {
  console.log("Start bulk to elasticsearch")

  await client.indices.create({
    index: "data"
  })
  const data = JSON.parse(fs.readFileSync(DUMMY_DATA_PATH, "utf8"))
  const body = []
  for (let entry of data) {
    body.push({
      create: { _index: "data", _id: entry.dataID }
    })
    delete entry.dataID
    body.push(entry)
  }
  await client.bulk({ refresh: true, body }, (err, res) => {
    if (res.errors) {
      console.log(JSON.stringify(res, null, 2))
    }
  })

  console.log("Finish bulk to elasticsearch")
}

if (require.main === module) {
  main()
}
