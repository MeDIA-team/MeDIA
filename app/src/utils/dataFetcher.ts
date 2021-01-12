import { DataOptions } from 'vuetify'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { Pagination } from '@/store/entry'
import { requiredFields } from '@/store/selector'
import {
  SampleEntry,
  PatientEntry,
  SampleFilterQuery,
  PatientFilterQuery,
  NestedFilterQuery,
} from '@/types/entry'
import { State as FilterState } from '@/store/filter'

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

  return res.aggregations.items.buckets
    .map((item: { key: string }) => item.key)
    .sort()
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

export const fetchEntries = async (
  viewType: 'sample' | 'patient',
  axios: NuxtAxiosInstance,
  options: DataOptions,
  pagination: Pagination,
  filterState: FilterState
): Promise<Array<SampleEntry | PatientEntry>> => {
  const sort = dataOptionsToQuery(viewType, options)
  const query = filterStateToQuery(viewType, viewType, filterState)
  const res = await axios.$get(`/api/${viewType}/_search`, {
    params: {
      source: JSON.stringify({
        track_total_hits: true,
        from: (pagination.page - 1) * pagination.itemsPerPage,
        size: pagination.itemsPerPage,
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
  filterState: FilterState
): Promise<number> => {
  const query = filterStateToQuery(viewType, indexType, filterState)
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
    let key = sortBy[i]
    const desc = sortDesc[i]
    switch (key) {
      case 'projectID':
      case 'projectName':
        key = 'projects.' + key
        break
      case 'patientID':
      case 'projectPatientIDs':
        break
      case 'sex':
      case 'age':
      case 'disease':
      case 'sampleID':
      case 'samplingDate':
        if (viewType === 'patient') {
          key = 'samples.' + key
        }
        break
      default:
        key = key.split('_')[1]
        if (viewType === 'sample') {
          key = 'dataTypes.' + key
        } else if (viewType === 'patient') {
          key = 'samples.dataTypes.' + key
        }
    }

    sort.push({
      [key]: {
        order: desc ? 'desc' : 'asc',
      },
    })
  }

  return sort
}

const filterStateToQuery = (
  viewType: 'sample' | 'patient',
  queryType: 'sample' | 'patient',
  filterState: FilterState
) => {
  const state = filterState[viewType]

  let query: SampleFilterQuery | PatientFilterQuery

  if (queryType === 'sample') {
    query = {
      bool: {
        filter: [
          {
            terms: {
              sex: state.sexes.selected,
            },
          },
          {
            range: {
              age: {
                gte: state.age.bottom || null,
                lte: state.age.upper || null,
              },
            },
          },
          {
            terms: {
              disease: state.diseases.selected,
            },
          },
          {
            range: {
              samplingDate: {
                gte: state.samplingDate.bottom || null,
                lte: state.samplingDate.upper || null,
              },
            },
          },
        ],
      },
    }
    if (state.sampleIDs.selected.length) {
      query.bool.filter.push({
        terms: {
          sampleID: state.sampleIDs.selected,
        },
      })
    }
    if (state.dataTypes.selected.length) {
      query.bool.filter.push({
        nested: {
          path: 'dataTypes',
          query: {
            terms: {
              'dataTypes.name': state.dataTypes.selected,
            },
          },
        },
      })
    }
  } else {
    const nestedQuery: NestedFilterQuery = {
      nested: {
        path: 'samples',
        query: {
          bool: {
            filter: [
              {
                terms: {
                  'samples.sex': state.sexes.selected,
                },
              },
              {
                range: {
                  'samples.age': {
                    gte: state.age.bottom || null,
                    lte: state.age.upper || null,
                  },
                },
              },
              {
                terms: {
                  'samples.disease': state.diseases.selected,
                },
              },
              {
                range: {
                  'samples.samplingDate': {
                    gte: state.samplingDate.bottom || null,
                    lte: state.samplingDate.upper || null,
                  },
                },
              },
            ],
          },
        },
      },
    }

    if (state.sampleIDs.selected.length) {
      nestedQuery.nested.query.bool.filter.push({
        terms: {
          sampleID: state.sampleIDs.selected,
        },
      })
    }
    if (state.dataTypes.selected.length) {
      nestedQuery.nested.query.bool.filter.push({
        nested: {
          path: 'dataTypes',
          query: {
            terms: {
              'dataTypes.name': state.dataTypes.selected,
            },
          },
        },
      })
    }

    query = {
      bool: {
        filter: [nestedQuery],
      },
    }
  }

  if (state.projects.selected.length) {
    query.bool.filter.push({
      nested: {
        path: 'projects',
        query: {
          terms: {
            'projects.projectName': state.projects.selected,
          },
        },
      },
    })
  }
  if (state.patientIDs.selected.length) {
    query.bool.filter.push({
      terms: {
        patientID: state.patientIDs.selected,
      },
    })
  }
  if (state.projectPatientIDs.selected.length) {
    query.bool.filter.push({
      terms: {
        projectPatientIDs: state.projectPatientIDs.selected,
      },
    })
  }

  return query
}
