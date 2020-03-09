export const fetchAggregatedValues = async (client, key) => {
  const res = await client.$get("/data/_search", {
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
  const res = await client.$get("/data")

  return Object.keys(res.data.mappings.properties)
}

const hasMetadataField = async (cilent, dataType, metadataField) => {
  const res = await cilent.$get("/data/_search", {
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
