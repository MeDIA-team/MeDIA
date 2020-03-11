#!/usr/bin/env node
"use strict"

const axios = require("axios")
const url = "http://db:9200"

const fetchAggregatedValues = async (key) => {
  const res = await axios.get(url + "/data/_search", {
    params: {
      source: JSON.stringify({
        size: 0,
        aggs: {
          items: {
            terms: { field: key }
          }
        }
      }),
      source_content_type: "application/json"
    }
  })

  return res.data.aggregations.items.buckets.map((item) => item.key)
}

const fetchFields = async () => {
  const res = await axios.get(url + "/data")

  return Object.keys(res.data.data.mappings.properties)
}

const hasMetadataField = async (dataType, metadataField) => {
  const res = await axios.get(url + "/data/_search", {
    params: {
      source: JSON.stringify({
        size: 0,
        query: {
          bool: {
            must: [
              {
                exists: {
                  field: metadataField
                }
              },
              { match: { dataType } }
            ]
          }
        }
      }),
      source_content_type: "application/json"
    }
  })

  return res.data.hits.total.value !== 0
}

const fetchDataTypesMetadataFields = async (dataTypes, metadataFields) => {
  const dataTypesMetadataFields = dataTypes.reduce((acc, dataType) => {
    acc[dataType] = []
    return acc
  }, {})
  for (const dataType of dataTypes) {
    for (const metadataField of metadataFields) {
      try {
        if (await hasMetadataField(dataType, metadataField)) {
          dataTypesMetadataFields[dataType].push(metadataField)
        }
      } catch (err) {
        console.log(err)
        console.log("Error")
      }
    }
  }

  return dataTypesMetadataFields
}

const fetchTotalEntriesNum = async () => {
  const res = await axios.get(url + "/data/_count")

  return res.data.count
}

const fetchEntries = async () => {
  const from = 100
  const size = 20
  const query = {
    bool: {
      should: []
    }
  }

  const res = await axios.get(url + "/data/_count")

  return res.data.count
}

const main = async () => {
  try {
  } catch (err) {
    console.log(err)
  }
}

if (require.main === module) {
  main()
}
