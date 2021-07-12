import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { DataOptions } from 'vuetify'
import {
  CheckboxFieldValue,
  ChipFieldValue,
  TextFieldValue,
  State as FilterState,
} from '@/store/filter'

export const fetchConfig = async (
  axios: NuxtAxiosInstance
): Promise<Config> => {
  const res = await axios.$get('/api/config/_search', {
    params: {
      source: JSON.stringify({
        query: {
          match_all: {},
        },
      }),
      source_content_type: 'application/json',
    },
  })

  return res.hits.hits[0]._source
}

export const fetchUniqueValues = async (
  axios: NuxtAxiosInstance,
  field: string
): Promise<string[]> => {
  const res = await axios.$get('/api/data/_search', {
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

  return res.aggregations.items.buckets
    .map((item: { key: string }) => item.key)
    .sort()
}

const fetchDataTypeHaveMetadataField = async (
  axios: NuxtAxiosInstance,
  field: string
): Promise<string[]> => {
  const res = await axios.$get('/api/data/_search', {
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
  axios: NuxtAxiosInstance,
  requiredFields: string[]
): Promise<Record<string, string[]>> => {
  const res = await axios.$get('/api/data/_mapping')
  const allFields: string[] = Object.keys(res.data.mappings.properties)
  const metadataFields = allFields.filter(
    (field) => ![...requiredFields, 'dataType'].includes(field)
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

export const fetchEntries = async (
  viewType: 'sample' | 'patient',
  axios: NuxtAxiosInstance,
  dataConfig: Config,
  options: DataOptions,
  filterState: FilterState
): Promise<Array<SampleEntry | PatientEntry>> => {
  const sort = dataOptionsToQuery(viewType, options)
  const query = filterStateToQuery(viewType, viewType, dataConfig, filterState)
  const res = await axios.$get(`/api/${viewType}/_search`, {
    params: {
      source: JSON.stringify({
        track_total_hits: true,
        from: (options.page - 1) * options.itemsPerPage,
        size: options.itemsPerPage,
        sort,
        query,
      }),
      source_content_type: 'application/json',
    },
  })

  const entries: Array<SampleEntry | PatientEntry> = res.hits.hits.map(
    (entry: { _source: SampleEntry | PatientEntry }) => entry._source
  )

  return entries
}

export const fetchCount = async (
  viewType: 'sample' | 'patient',
  indexType: 'sample' | 'patient',
  axios: NuxtAxiosInstance,
  dataConfig: Config,
  filterState: FilterState
): Promise<number> => {
  const query = filterStateToQuery(viewType, indexType, dataConfig, filterState)
  const res = await axios.$get(`/api/${indexType}/_count`, {
    params: {
      source: JSON.stringify({
        query,
      }),
      source_content_type: 'application/json',
    },
  })

  return res.count
}

const dataOptionsToQuery = (
  viewType: 'sample' | 'patient',
  options: DataOptions
) => {
  const { sortBy, sortDesc } = options
  const sort = []
  for (let i = 0; i < sortBy.length; i++) {
    const key = sortBy[i]
    const desc = sortDesc[i]
    if (viewType === 'sample') {
      if (key.includes('_')) {
        const dataType = key.split('_')[0]
        const metaKey = key.split('_')[1]
        sort.push({
          [`dataTypes.${metaKey}`]: {
            order: desc ? 'desc' : 'asc',
            nested: {
              path: 'dataTypes',
              filter: {
                term: {
                  'dataTypes.name': dataType,
                },
              },
            },
          },
        })
      } else {
        sort.push({
          [key]: {
            order: desc ? 'desc' : 'asc',
          },
        })
      }
    } else if (viewType === 'patient') {
      if (key.includes('_')) {
        const dataType = key.split('_')[0]
        const metaKey = key.split('_')[1]
        sort.push({
          [`samples.dataTypes.${metaKey}`]: {
            order: desc ? 'desc' : 'asc',
            nested: {
              path: 'samples.dataTypes',
              filter: {
                term: {
                  'samples.dataTypes.name': dataType,
                },
              },
            },
          },
        })
      } else if (key === 'patientId') {
        sort.push({
          patientId: {
            order: desc ? 'desc' : 'asc',
          },
        })
      } else {
        sort.push({
          [`samples.${key}`]: {
            order: desc ? 'desc' : 'asc',
            nested_path: 'samples',
          },
        })
      }
    }
  }

  return sort
}

const filterStateToQuery = (
  viewType: 'sample' | 'patient',
  queryType: 'sample' | 'patient',
  dataConfig: Config,
  filterState: FilterState
): FilterQuery | NestedFilterQuery => {
  const state = filterState[viewType]
  if (queryType === 'sample') {
    const query: FilterQuery = {
      bool: {
        filter: [],
      },
    }
    for (const field of dataConfig.filter.fields) {
      if (field.id === 'dataType') {
        field as ChipField
        const fieldValue = state.fields[field.id] as ChipFieldValue
        if (fieldValue.selected.length) {
          for (const dataType of fieldValue.selected) {
            query.bool.filter.push({
              nested: {
                path: 'dataTypes',
                query: {
                  term: {
                    'dataTypes.name': dataType,
                  },
                },
              },
            })
          }
        }
        continue
      }
      if (field.form.type === 'checkbox') {
        field as CheckboxField
        const fieldValue = state.fields[field.id] as CheckboxFieldValue
        if (fieldValue.selected.length) {
          query.bool.filter.push({
            terms: { [field.id]: fieldValue.selected },
          })
        }
      } else if (field.form.type === 'chip') {
        field as ChipField
        const fieldValue = state.fields[field.id] as ChipFieldValue
        if (field.form.logic === 'OR') {
          if (fieldValue.selected.length) {
            query.bool.filter.push({
              terms: { [field.id]: fieldValue.selected },
            })
          }
        } else if (field.form.logic === 'AND') {
          if (fieldValue.selected.length) {
            for (const value of fieldValue.selected) {
              query.bool.filter.push({
                term: {
                  [field.id]: value,
                },
              })
            }
          }
        }
      } else if (field.form.type === 'text') {
        field as TextField
        const fieldValue = state.fields[field.id] as TextFieldValue
        query.bool.filter.push({
          range: {
            [field.id]: {
              gte: fieldValue.bottom || null,
              lte: fieldValue.upper || null,
            },
          },
        })
      }
    }

    return query
  } else {
    const query: NestedFilterQuery = {
      nested: {
        path: 'samples',
        query: {
          bool: {
            filter: [],
          },
        },
      },
    }
    for (const field of dataConfig.filter.fields) {
      if (field.id === 'dataType') {
        field as ChipField
        const fieldValue = state.fields[field.id] as ChipFieldValue
        if (fieldValue.selected.length) {
          for (const dataType of fieldValue.selected) {
            query.nested.query.bool.filter.push({
              nested: {
                path: 'samples.dataTypes',
                query: {
                  term: {
                    'samples.dataTypes.name': dataType,
                  },
                },
              },
            })
          }
        }
        continue
      } else if (field.id === 'patientId') {
        field as ChipField
        const fieldValue = state.fields[field.id] as ChipFieldValue
        if (fieldValue.selected.length) {
          query.nested.query.bool.filter.push({
            terms: { [field.id]: fieldValue.selected },
          })
        }
        continue
      }
      if (field.form.type === 'checkbox') {
        field as CheckboxField
        const fieldValue = state.fields[field.id] as CheckboxFieldValue
        if (fieldValue.selected.length) {
          query.nested.query.bool.filter.push({
            terms: { [`samples.${field.id}`]: fieldValue.selected },
          })
        }
      } else if (field.form.type === 'chip') {
        field as ChipField
        const fieldValue = state.fields[field.id] as ChipFieldValue
        if (field.form.logic === 'OR') {
          if (fieldValue.selected.length) {
            query.nested.query.bool.filter.push({
              terms: { [`samples.${field.id}`]: fieldValue.selected },
            })
          }
        } else if (field.form.logic === 'AND') {
          if (fieldValue.selected.length) {
            for (const value of fieldValue.selected) {
              query.nested.query.bool.filter.push({
                term: {
                  [`samples.${field.id}`]: value,
                },
              })
            }
          }
        }
      } else if (field.form.type === 'text') {
        field as TextField
        const fieldValue = state.fields[field.id] as TextFieldValue
        query.nested.query.bool.filter.push({
          range: {
            [`samples.${field.id}`]: {
              gte: fieldValue.bottom || null,
              lte: fieldValue.upper || null,
            },
          },
        })
      }
    }

    return query
  }
}
