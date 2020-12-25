import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { requiredFields } from '@/store/selector'

export const fetchUniqueValues = async (
  axios: NuxtAxiosInstance,
  field: string
): Promise<string[]> => {
  const res = await axios.$get('/api/entry/_search', {
    params: {
      source: JSON.stringify({
        track_total_hits: true,
        size: 0,
        aggs: {
          items: {
            terms: {
              field,
              size: 10000000,
            },
          },
        },
      }),
      source_content_type: 'application/json',
    },
  })

  return (
    res.aggregations.items.buckets
      .map((item: { key: string }) => item.key)
      .sort() || []
  )
}

const fetchDataTypeHaveMetadataField = async (
  axios: NuxtAxiosInstance,
  field: string
): Promise<string[]> => {
  const res = await axios.$get('/api/entry/_search', {
    params: {
      source: JSON.stringify({
        track_total_hits: true,
        size: 10000000,
        query: {
          exists: {
            field,
          },
        },
        collapse: {
          field: 'dataType',
        },
        _source: false,
      }),
      source_content_type: 'application/json',
    },
  })

  return res.hits.hits.map(
    (doc: { fields: { dataType: string[] } }) => doc.fields.dataType[0]
  )
}

export const fetchDataTypeToMetadataFields = async (
  axios: NuxtAxiosInstance
): Promise<Record<string, string[]>> => {
  const res = await axios.$get('/api/entry/_mapping')
  const allFields: string[] = Object.keys(res.entry.mappings.properties)
  const metadataFields = allFields.filter(
    (field) => !requiredFields.includes(field)
  )
  const dataTypes = await fetchUniqueValues(axios, 'dataType')
  const dataTypeToMetadataFields: Record<string, string[]> = dataTypes.reduce(
    (prev: Record<string, string[]>, cur: string) => ({ ...prev, [cur]: [] }),
    {}
  )
  const queue = metadataFields.map((field) =>
    fetchDataTypeHaveMetadataField(axios, field)
  )
  const results = await Promise.all(queue)
  for (let i = 0; i < metadataFields.length; i++) {
    const metadataField = metadataFields[i]
    const dataTypes = results[i]
    dataTypes.forEach((dataType) => {
      dataTypeToMetadataFields[dataType].push(metadataField)
    })
  }
  for (const [key, value] of Object.entries(dataTypeToMetadataFields)) {
    dataTypeToMetadataFields[key] = value.sort()
  }

  return dataTypeToMetadataFields
}
