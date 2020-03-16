export const fetchProjects = async (client) => {
  const projects = await fetchUniqueValues(client, "projectName")

  return projects
}

export const fetchSexes = async (client) => {
  const sexes = await fetchUniqueValues(client, "sex")

  return sexes
}

export const fetchDataTypes = async (client) => {
  const dataTypes = await fetchUniqueValues(client, "dataType")

  return dataTypes
}

const fetchUniqueValues = async (client, field) => {
  const res = await client.$get("/api/data/_search", {
    params: {
      source: JSON.stringify({
        track_total_hits: true,
        size: 0,
        aggs: {
          items: {
            terms: {
              field
            }
          }
        }
      }),
      source_content_type: "application/json"
    }
  })

  return res.aggregations.items.buckets.map((item) => item.key)
}

export const defaultFields = [
  "projectName",
  "projectID",
  "patientID",
  "sex",
  "age",
  "sampleID",
  "samplingDate",
  "dataType"
]

export const fetchDataTypesMetadataFields = async (client) => {
  const dataTypes = await fetchDataTypes(client)
  const dataTypesMetadataFields = dataTypes.reduce(
    (acc, cur) => ({ ...acc, [cur]: [] }),
    {}
  )
  const metadataFields = await fetchMetadataFields(client)
  const queue = []
  metadataFields.forEach((metadataFields) => {
    queue.push(fetchDataTypesHaveMetadataField(client, metadataFields))
  })
  const results = await Promise.all(queue)
  metadataFields.forEach((metadataFields, ind) => {
    const dataTypes = results[ind]
    dataTypes.forEach((dataType) => {
      dataTypesMetadataFields[dataType].push(metadataFields)
    })
  })

  return dataTypesMetadataFields
}

const fetchMetadataFields = async (client) => {
  const allFields = await fetchAllFields(client)

  return allFields.filter((field) => !defaultFields.includes(field))
}

const fetchAllFields = async (client) => {
  const res = await client.$get("/api/data/_mapping")

  return Object.keys(res.data.mappings.properties)
}

const fetchDataTypesHaveMetadataField = async (client, metadataField) => {
  const res = await client.$get("/api/data/_search", {
    params: {
      source: JSON.stringify({
        track_total_hits: true,
        size: 10000,
        collapse: {
          field: "dataType"
        },
        query: {
          exists: {
            field: metadataField
          }
        },
        _source: "dataType"
      }),
      source_content_type: "application/json"
    }
  })

  return res.hits.hits.map((doc) => doc._source.dataType)
}

export const fetchTotalEntriesNum = async (client) => {
  const res = await client.$get("/api/data/_search", {
    params: {
      source: JSON.stringify({
        track_total_hits: true,
        size: 0,
        collapse: {
          field: "sampleID"
        },
        query: {
          match_all: {}
        },
        aggs: {
          total_count: {
            cardinality: {
              field: "sampleID"
            }
          }
        }
      }),
      source_content_type: "application/json"
    }
  })

  return res.aggregations.total_count.value
}

export const fetchEntriesNum = async (client, filterState) => {
  const query = filterStateToQuery(filterState)
  const res = await client.$get("/api/data/_search", {
    params: {
      source: JSON.stringify({
        track_total_hits: true,
        size: 0,
        collapse: {
          field: "sampleID"
        },
        query,
        aggs: {
          total_count: {
            cardinality: {
              field: "sampleID"
            }
          }
        }
      }),
      source_content_type: "application/json"
    }
  })

  return res.aggregations.total_count.value
}

export const fetchEntries = async (client, filterState, optionContext) => {
  const sampleIDs = await fetchSampleIDs(client, filterState, optionContext)
  const entriesDoc = await fetchEntriesDoc(client, sampleIDs)
  const entryObj = sampleIDs.reduce((arr, cur) => ({ ...arr, [cur]: {} }), {})
  entriesDoc.forEach((doc) => {
    const sampleID = doc.sampleID
    const dataType = doc.dataType
    Object.entries(doc).forEach(([key, val]) => {
      if (
        [
          "projectID",
          "projectName",
          "patientID",
          "sex",
          "age",
          "sampleID",
          "samplingDate"
        ].includes(key)
      ) {
        entryObj[sampleID][key] = val
      } else if (key === "dataType") {
        entryObj[sampleID][dataType] = true
      } else {
        entryObj[sampleID][dataType + "_" + key] = val
      }
    })
  })

  return Object.values(entryObj)
}

const filterStateToQuery = (filterState) => {
  const {
    selectedProjects,
    inputtedPatientID,
    selectedSexes,
    inputtedBottomAge,
    inputtedUpperAge,
    inputtedSampleID,
    inputtedBottomSamplingDate,
    inputtedUpperSamplingDate
  } = filterState

  const query = {
    bool: {
      must: [
        {
          terms: {
            projectName: selectedProjects
          }
        },
        {
          wildcard: {
            patientID: {
              value: inputtedPatientID + "*"
            }
          }
        },
        {
          terms: {
            sex: selectedSexes
          }
        },
        {
          range: {
            age: {
              gte: inputtedBottomAge || null,
              lte: inputtedUpperAge || null
            }
          }
        },
        {
          wildcard: {
            sampleID: {
              value: inputtedSampleID + "*"
            }
          }
        },
        {
          range: {
            samplingDate: {
              gte: inputtedBottomSamplingDate || null,
              lte: inputtedUpperSamplingDate || null
            }
          }
        }
      ]
    }
  }

  return query
}

const fetchSampleIDs = async (client, filterState, optionContext) => {
  const { page, itemsPerPage, sortBy, sortDesc } = optionContext
  const from = itemsPerPage !== -1 ? (page - 1) * itemsPerPage : 0
  const size = itemsPerPage !== -1 ? itemsPerPage : 10000
  const query = filterStateToQuery(filterState)
  const sort = contextToSort(sortBy, sortDesc)
  const res = await client.$get("/api/data/_search", {
    params: {
      source: JSON.stringify({
        track_total_hits: true,
        from,
        size,
        collapse: {
          field: "sampleID"
        },
        query,
        sort,
        _source: ["sampleID"]
      }),
      source_content_type: "application/json"
    }
  })

  return res.hits.hits.map((doc) => doc._source.sampleID)
}

const contextToSort = (sortBy, sortDesc) => {
  const sort = []
  sortBy.forEach((key, ind) => {
    sort.push({
      [key]: {
        order: sortDesc[ind] ? "desc" : "asc"
      }
    })
  })

  return sort
}

const fetchEntriesDoc = async (client, sampleIDs) => {
  const res = await client.$get("/api/data/_search", {
    params: {
      source: JSON.stringify({
        track_total_hits: true,
        size: 10000,
        query: {
          terms: {
            sampleID: sampleIDs
          }
        }
      }),
      source_content_type: "application/json"
    }
  })

  return res.hits.hits.map((doc) => doc._source)
}
