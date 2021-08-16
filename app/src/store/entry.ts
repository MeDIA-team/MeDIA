import Vue from 'vue'
import { ActionTree, MutationTree } from 'vuex'
import { DataOptions } from 'vuetify'
import { RootState } from '@/store'
import { fetchEntries, fetchCount } from '@/utils/dataFetcher'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

const DATA_OPTIONS: DataOptions = {
  page: 1,
  itemsPerPage: 30,
  sortBy: [],
  sortDesc: [],
  groupBy: [],
  groupDesc: [],
  mustSort: false,
  multiSort: true,
}

export type State = {
  sample: {
    options: DataOptions
    contents: DataEntry[]
    selected: DataEntry[]
  }
  patient: {
    options: DataOptions
    contents: DataEntry[]
    selected: DataEntry[]
  }
}

export const state = (): State => ({
  sample: {
    options: { ...DATA_OPTIONS },
    contents: [],
    selected: [],
  },
  patient: {
    options: { ...DATA_OPTIONS },
    contents: [],
    selected: [],
  },
})

export const mutations: MutationTree<State> = {
  setValue(
    state,
    payload: {
      viewType: keyof State
      fieldType: keyof State['sample']
      value: boolean | number | DataEntry[]
    }
  ) {
    Vue.set(state[payload.viewType], payload.fieldType, payload.value)
  },

  setOptions(
    state,
    payload: {
      viewType: keyof State
      value: DataOptions
    }
  ) {
    Vue.set(state[payload.viewType], 'options', payload.value)
  },
}

const arrayToString = (arr: Array<string | number>) => {
  return Array.from(new Set(arr)).sort().join(', ')
}

export const actions: ActionTree<State, RootState> = {
  async updateEntries(
    { commit, state, rootState },
    payload: {
      viewType: keyof State
      axios: NuxtAxiosInstance
      dataConfig: Config
    }
  ) {
    const fetchedEntries = await fetchEntries(
      payload.viewType,
      payload.axios,
      payload.dataConfig,
      state[payload.viewType].options,
      rootState.filter
    )
    const entries: DataEntry[] = []
    if (payload.viewType === 'sample') {
      for (const fetchedEntry of fetchedEntries as SampleEntry[]) {
        const entry: DataEntry = {
          sampleId: fetchedEntry.sampleId,
          patientId: fetchedEntry.patientId,
        }
        for (const [key, value] of Object.entries(fetchedEntry)) {
          if (['sampleId', 'patientId'].includes(key)) {
            continue
          } else if (key === 'dataTypes') {
            for (const dataType of fetchedEntry.dataTypes) {
              entry[dataType.name] = true
              for (const [metaDataTypeKey, metaDataTypeValue] of Object.entries(
                dataType
              )) {
                if (metaDataTypeKey !== 'name') {
                  entry[`${dataType.name}: ${metaDataTypeKey}`] =
                    metaDataTypeValue
                }
              }
            }
          } else {
            entry[key] = arrayToString(value as string[] | number[])
          }
        }
        entries.push(entry)
      }
    } else if (payload.viewType === 'patient') {
      for (const fetchedEntry of fetchedEntries as PatientEntry[]) {
        const entry: DataEntry = {
          sampleId: arrayToString(
            fetchedEntry.samples.map((sample) => sample.sampleId)
          ),
          patientId: fetchedEntry.patientId,
        }
        const uniqueKeys = Array.from(
          new Set(fetchedEntry.samples.flatMap((sample) => Object.keys(sample)))
        ).filter((key) => !['sampleId', 'dataTypes'].includes(key))
        for (const key of uniqueKeys) {
          entry[key] = arrayToString(
            fetchedEntry.samples.flatMap((sample) => sample[key] || []) as
              | string[]
              | number[]
          )
        }
        const dataTypeValues: Record<string, Array<string | number>> = {}
        for (const dataTypes of fetchedEntry.samples.map(
          (sample) => sample.dataTypes
        )) {
          for (const dataType of dataTypes) {
            entry[dataType.name] = true
            for (const [metaDataTypeKey, metaDataTypeValue] of Object.entries(
              dataType
            )) {
              if (metaDataTypeKey !== 'name') {
                if (`${dataType.name}: ${metaDataTypeKey}` in dataTypeValues) {
                  dataTypeValues[`${dataType.name}: ${metaDataTypeKey}`].push(
                    metaDataTypeValue as string | number
                  )
                } else {
                  dataTypeValues[`${dataType.name}: ${metaDataTypeKey}`] = [
                    metaDataTypeValue as string | number,
                  ]
                }
              }
            }
          }
        }
        for (const [key, value] of Object.entries(dataTypeValues)) {
          entry[key] = arrayToString(value)
        }
        entries.push(entry)
      }
    }

    commit('setValue', {
      viewType: payload.viewType,
      fieldType: 'contents',
      value: entries,
    })
  },

  async updateEntryCount(
    { commit, rootState },
    payload: {
      viewType: keyof State
      axios: NuxtAxiosInstance
      dataConfig: Config
    }
  ) {
    const sampleCount = await fetchCount(
      payload.viewType,
      'sample',
      payload.axios,
      payload.dataConfig,
      rootState.filter
    )
    const patientCount = await fetchCount(
      payload.viewType,
      'patient',
      payload.axios,
      payload.dataConfig,
      rootState.filter
    )

    commit(
      'filter/setCount',
      {
        viewType: payload.viewType,
        countCategory: 'sample',
        countType: 'filtered',
        value: sampleCount,
      },
      { root: true }
    )
    commit(
      'filter/setCount',
      {
        viewType: payload.viewType,
        countCategory: 'patient',
        countType: 'filtered',
        value: patientCount,
      },
      { root: true }
    )
  },
}

const SEARCH_MAX = 10000000

export const allEntries = async (payload: {
  viewType: keyof State
  axios: NuxtAxiosInstance
  dataConfig: Config
  rootState: RootState
  entryState: State
}): Promise<DataEntry[]> => {
  const options = { ...payload.entryState[payload.viewType].options }
  options.itemsPerPage = SEARCH_MAX
  const fetchedEntries = await fetchEntries(
    payload.viewType,
    payload.axios,
    payload.dataConfig,
    options,
    payload.rootState.filter
  )
  const entries: DataEntry[] = []
  if (payload.viewType === 'sample') {
    for (const fetchedEntry of fetchedEntries as SampleEntry[]) {
      const entry: DataEntry = {
        sampleId: fetchedEntry.sampleId,
        patientId: fetchedEntry.patientId,
      }
      for (const [key, value] of Object.entries(fetchedEntry)) {
        if (['sampleId', 'patientId'].includes(key)) {
          continue
        } else if (key === 'dataTypes') {
          for (const dataType of fetchedEntry.dataTypes) {
            entry[dataType.name] = true
            for (const [metaDataTypeKey, metaDataTypeValue] of Object.entries(
              dataType
            )) {
              if (metaDataTypeKey !== 'name') {
                entry[`${dataType.name}: ${metaDataTypeKey}`] =
                  metaDataTypeValue
              }
            }
          }
        } else {
          entry[key] = arrayToString(value as string[] | number[])
        }
      }
      entries.push(entry)
    }
  } else if (payload.viewType === 'patient') {
    for (const fetchedEntry of fetchedEntries as PatientEntry[]) {
      const entry: DataEntry = {
        sampleId: arrayToString(
          fetchedEntry.samples.map((sample) => sample.sampleId)
        ),
        patientId: fetchedEntry.patientId,
      }
      const uniqueKeys = Array.from(
        new Set(fetchedEntry.samples.flatMap((sample) => Object.keys(sample)))
      ).filter((key) => !['sampleId', 'dataTypes'].includes(key))
      for (const key of uniqueKeys) {
        entry[key] = arrayToString(
          fetchedEntry.samples.flatMap((sample) => sample[key] || []) as
            | string[]
            | number[]
        )
      }
      const dataTypeValues: Record<string, Array<string | number>> = {}
      for (const dataTypes of fetchedEntry.samples.map(
        (sample) => sample.dataTypes
      )) {
        for (const dataType of dataTypes) {
          entry[dataType.name] = true
          for (const [metaDataTypeKey, metaDataTypeValue] of Object.entries(
            dataType
          )) {
            if (metaDataTypeKey !== 'name') {
              if (`${dataType.name}: ${metaDataTypeKey}` in dataTypeValues) {
                dataTypeValues[`${dataType.name}: ${metaDataTypeKey}`].push(
                  metaDataTypeValue as string | number
                )
              } else {
                dataTypeValues[`${dataType.name}: ${metaDataTypeKey}`] = [
                  metaDataTypeValue as string | number,
                ]
              }
            }
          }
        }
      }
      for (const [key, value] of Object.entries(dataTypeValues)) {
        entry[key] = arrayToString(value)
      }
      entries.push(entry)
    }
  }

  return entries
}
