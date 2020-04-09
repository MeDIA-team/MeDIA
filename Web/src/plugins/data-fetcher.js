export default (context, inject) => {
  const fetchUniqueValues = async (field) => {
    const res = await context.$axios
      .$get("/api/data/_search", {
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
      .catch((error) => {
        console.error(error.response)
        return null
      })

    return res === null
      ? []
      : res.aggregations.items.buckets.map((item) => item.key)
  }

  const fetchMetadataFields = async () => {
    const allFields = await fetchAllFields()

    return allFields.filter((field) => !defaultFields.includes(field))
  }

  const fetchAllFields = async () => {
    const res = await context.$axios
      .$get("/api/data/_mapping")
      .catch((error) => {
        console.error(error.response)
        return null
      })

    return res === null ? [] : Object.keys(res.data.mappings.properties)
  }

  const fetchDataTypesMetadataFields = async () => {
    const dataTypes = await fetchUniqueValues("dataType")
    const dataTypesMetadataFields = dataTypes.reduce(
      (acc, cur) => ({ ...acc, [cur]: [] }),
      {}
    )
    const metadataFields = await fetchMetadataFields()
    const queue = []
    metadataFields.forEach((metadataFields) => {
      queue.push(fetchDataTypesHaveMetadataField(metadataFields))
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

  const fetchDataTypesHaveMetadataField = async (metadataField) => {
    const res = await context.$axios
      .$get("/api/data/_search", {
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
      .catch((error) => {
        console.error(error.response)
        return null
      })

    return res === null ? [] : res.hits.hits.map((doc) => doc._source.dataType)
  }

  const fetchTotalEntriesNum = async () => {
    const res = await context.$axios
      .$get("/api/data/_search", {
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
      .catch((error) => {
        console.error(error.response)
        return null
      })

    return res === null ? 0 : res.aggregations.total_count.value
  }

  const fetchEntriesNum = async (filterState) => {
    const query = filterStateToQuery(filterState)
    const res = await context.$axios
      .$get("/api/data/_search", {
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
      .catch((error) => {
        console.error(error.response)
        return null
      })

    return res === null ? 0 : res.aggregations.total_count.value
  }

  const fetchEntries = async (filterState, optionContext) => {
    const sampleIDs = await fetchSampleIDs(filterState, optionContext)
    const entriesDoc = await fetchEntriesDoc(sampleIDs)
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

  const fetchSampleIDs = async (filterState, optionContext) => {
    const { page, itemsPerPage, sortBy, sortDesc } = optionContext
    const from = itemsPerPage !== -1 ? (page - 1) * itemsPerPage : 0
    const size = itemsPerPage !== -1 ? itemsPerPage : 10000
    const query = filterStateToQuery(filterState)
    const sort = contextToSort(sortBy, sortDesc)
    const res = await context.$axios
      .$get("/api/data/_search", {
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
      .catch((error) => {
        console.error(error.response)
        return null
      })

    return res === null ? [] : res.hits.hits.map((doc) => doc._source.sampleID)
  }

  const fetchEntriesDoc = async (sampleIDs) => {
    const res = await context.$axios
      .$get("/api/data/_search", {
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
      .catch((error) => {
        console.error(error.response)
        return null
      })

    return res === null ? [] : res.hits.hits.map((doc) => doc._source)
  }

  const functions = {
    fetchUniqueValues,
    fetchMetadataFields,
    fetchAllFields,
    fetchDataTypesMetadataFields,
    fetchDataTypesHaveMetadataField,
    fetchTotalEntriesNum,
    fetchEntriesNum,
    fetchEntries,
    fetchSampleIDs,
    fetchEntriesDoc
  }
  inject("dataFetcher", functions)
}

const defaultFields = [
  "projectName",
  "projectID",
  "patientID",
  "sex",
  "age",
  "sampleID",
  "samplingDate",
  "dataType"
]

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