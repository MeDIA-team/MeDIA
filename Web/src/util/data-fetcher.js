export const fetchAggregatedValues = async (client, key) => {
  const res = await client.$get("/api/data/_search", {
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

  return res.aggregations.items.buckets.map((item) => item.key)
}

export const fetchFields = async (client) => {
  const res = await client.$get("/api/data")

  return Object.keys(res.data.mappings.properties)
}

const hasMetadataField = async (client, dataType, metadataField) => {
  const res = await client.$get("/api/data/_search", {
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

  return res.hits.total.value !== 0
}

export const fetchDataTypesMetadataFields = async (
  client,
  dataTypes,
  metadataFields
) => {
  const dataTypesMetadataFields = dataTypes.reduce((acc, dataType) => {
    acc[dataType] = []
    return acc
  }, {})
  for (const dataType of dataTypes) {
    for (const metadataField of metadataFields) {
      if (await hasMetadataField(client, dataType, metadataField)) {
        dataTypesMetadataFields[dataType].push(metadataField)
      }
    }
  }

  return dataTypesMetadataFields
}

export const fetchTotalEntriesNum = async (client) => {
  const res = await client.$get("/api/data/_count")

  return res.count
}

export const fetchEntries = async (client, filterState) => {
  const query = filterStateToQuery(filterState)
  console.log(query)
  if (query.length !== 0) {
    const res = await client.$get("/api/data/_search", {
      params: {
        source: JSON.stringify(query),
        source_content_type: "application/json"
      }
    })

    console.log(res)
  }
  await console.log("----")

  const entries = []

  return entries
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
    inputtedUpperSamplingDate,
    selectedDataTypes
  } = filterState

  const filters = []
  if (selectedProjects.length !== 0) {
    filters.push({
      bool: {
        should: selectedProjects.map((ele) => ({
          match: { projectName: ele }
        }))
      }
    })
  }
  if (inputtedPatientID !== "") {
    filters.push({
      regexp: {
        patientID: inputtedPatientID + ".*"
      }
    })
  }
  if (selectedSexes.length !== 0) {
    filters.push({
      bool: {
        should: selectedSexes.map((ele) => ({
          match: { sex: ele }
        }))
      }
    })
  }
  if (inputtedBottomAge !== "" || inputtedUpperAge !== "") {
    const filter = {
      range: {
        age: {}
      }
    }
    if (inputtedBottomAge !== "") {
      filter.range.age.gte = inputtedBottomAge
    }
    if (inputtedUpperAge !== "") {
      filter.range.age.lte = inputtedUpperAge
    }
    filters.push(filter)
  }
  if (inputtedSampleID !== "") {
    filters.push({
      regexp: {
        satientID: inputtedSampleID + ".*"
      }
    })
  }
  if (inputtedBottomSamplingDate !== "" || inputtedUpperSamplingDate !== "") {
    const filter = {
      range: {
        samplingDate: {}
      }
    }
    if (inputtedBottomSamplingDate !== "") {
      filter.range.samplingDate.gte = inputtedBottomSamplingDate
    }
    if (inputtedUpperSamplingDate !== "") {
      filter.range.samplingDate.lte = inputtedUpperSamplingDate
    }
    filters.push(filter)
  }
  if (selectedDataTypes.length !== 0) {
    filters.push({
      bool: {
        should: selectedDataTypes.map((ele) => ({
          match: { dataType: ele }
        }))
      }
    })
  }
  const query = { query: { bool: { filter: filters } } }

  return query
}
