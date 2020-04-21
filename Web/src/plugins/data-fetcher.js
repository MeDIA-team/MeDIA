export default (ctx, inject) => {
  const fetchUniqueValues = async (field) => {
    const res = await ctx.$axios
      .$get("/api/data/_search", {
        params: {
          source: JSON.stringify({
            track_total_hits: true,
            size: 0,
            aggs: {
              items: {
                terms: {
                  field,
                  size: ctx.store.state.const.elasticsearchSize
                }
              }
            }
          }),
          source_content_type: "application/json"
        }
      })
      .catch((err) => {
        throw err
      })

    return res.aggregations.items.buckets.map((item) => item.key).sort() || []
  }

  const fetchAllFields = async () => {
    const res = await ctx.$axios.$get("/api/data/_mapping").catch((err) => {
      throw err
    })

    return Object.keys(res.data.mappings.properties) || []
  }

  const fetchMetadataFields = async () => {
    const allFields = await fetchAllFields().catch((err) => {
      throw err
    })
    const requiredFields = ctx.store.state.const.requiredFields.map(
      (item) => item.key
    )

    return allFields.filter((field) => !requiredFields.includes(field)) || []
  }

  const fetchDataTypeFields = async () => {
    const dataTypes = await fetchUniqueValues("dataType").catch((err) => {
      throw err
    })
    const dataTypeFields = dataTypes.reduce(
      (acc, cur) => ({ ...acc, [cur]: [] }),
      {}
    )
    const metadataFields = await fetchMetadataFields().catch((err) => {
      throw err
    })
    const queue = []
    metadataFields.forEach((field) => {
      queue.push(fetchDataTypeHaveMetadataField(field))
    })
    const results = await Promise.all(queue).catch((err) => {
      throw err
    })
    for (let i = 0; i < results.length; i++) {
      const metadataField = metadataFields[i]
      const dataTypes = results[i]
      dataTypes.forEach((dataType) => {
        dataTypeFields[dataType].push(metadataField)
      })
    }
    for (const [key, value] of Object.entries(dataTypeFields)) {
      dataTypeFields[key] = value.sort()
    }

    return dataTypeFields
  }

  const fetchDataTypeHaveMetadataField = async (metadataField) => {
    const res = await ctx.$axios
      .$get("/api/data/_search", {
        params: {
          source: JSON.stringify({
            track_total_hits: true,
            size: ctx.store.state.const.elasticsearchSize,
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
      .catch((err) => {
        throw err
      })

    return res.hits.hits.map((doc) => doc._source.dataType) || []
  }

  const fetchFilteredAndSortedSampleIDs = async (
    optionContext,
    filterState
  ) => {
    const { sortBy, sortDesc } = optionContext
    const sort = sortContextToQuery(sortBy, sortDesc)
    const filter = filterStateToQuery(filterState)
    const res = await ctx.$axios
      .$get("/api/data/_search", {
        params: {
          source: JSON.stringify({
            track_total_hits: true,
            size: ctx.store.state.const.elasticsearchSize,
            collapse: {
              field: "sampleID"
            },
            sort,
            query: filter,
            _source: false
          }),
          source_content_type: "application/json"
        }
      })
      .catch((err) => {
        throw err
      })

    return res.hits.hits.map((doc) => doc.fields.sampleID[0]) || []
  }

  const fetchSampleIDTable = async (field) => {
    const res = await ctx.$axios
      .$get("/api/data/_search", {
        params: {
          source: JSON.stringify({
            track_total_hits: true,
            size: ctx.store.state.const.elasticsearchSize,
            query: {
              match_all: {}
            },
            collapse: {
              field: "sampleID",
              inner_hits: {
                name: field,
                size: ctx.store.state.const.elasticsearchSize,
                _source: [field],
                collapse: {
                  field
                }
              }
            },
            _source: false
          }),
          source_content_type: "application/json"
        }
      })
      .catch((err) => {
        throw err
      })
    const table = {}
    for (const item of res.hits.hits) {
      const sampleID = item.fields.sampleID[0]
      table[sampleID] = new Set(
        item.inner_hits[field].hits.hits.map((item) => item._source[field])
      )
    }

    return table
  }

  const fetchEntryDocs = async (sampleIDs) => {
    const res = await ctx.$axios
      .$get("/api/data/_search", {
        params: {
          source: JSON.stringify({
            track_total_hits: true,
            size: ctx.store.state.const.elasticsearchSize,
            query: {
              terms: {
                sampleID: sampleIDs
              }
            }
          }),
          source_content_type: "application/json"
        }
      })
      .catch((err) => {
        throw err
      })

    return res.hits.hits.map((doc) => doc._source) || []
  }

  const functions = {
    fetchUniqueValues,
    fetchDataTypeFields,
    fetchFilteredAndSortedSampleIDs,
    fetchSampleIDTable,
    fetchEntryDocs
  }

  inject("dataFetcher", functions)
}

const sortContextToQuery = (sortBy, sortDesc) => {
  const sort = []
  for (let i = 0; i < sortBy.length; i++) {
    const key = sortBy[i].includes("_") ? sortBy[i].split("_")[1] : sortBy[i]
    const desc = sortDesc[i]
    sort.push({
      [key]: {
        order: desc ? "desc" : "asc"
      }
    })
  }

  return sort
}

const filterStateToQuery = (filterState) => {
  const {
    selectedProjects,
    inputtedPatientIDs,
    selectedSexes,
    inputtedBottomAge,
    inputtedUpperAge,
    selectedDiseases,
    inputtedSampleIDs,
    inputtedBottomSamplingDate,
    inputtedUpperSamplingDate
  } = filterState

  const query = {
    bool: {
      filter: [
        {
          terms: {
            projectName: selectedProjects
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
          terms: {
            disease: selectedDiseases
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

  if (inputtedSampleIDs.length !== 0) {
    query.bool.filter.push({
      terms: {
        sampleID: inputtedSampleIDs
      }
    })
  }
  if (inputtedPatientIDs.length !== 0) {
    query.bool.filter.push({
      terms: {
        patientID: inputtedPatientIDs
      }
    })
  }

  return query
}
