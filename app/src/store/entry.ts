import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { DataOptions } from 'vuetify'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { fetchEntries, fetchCount } from '@/utils/dataFetcher'
import { Entry, PatientEntry, SampleEntry } from '@/types/entry'

export type Pagination = {
  page: number
  itemsPerPage: number
  pageStart: number
  pageStop: number
  pageCount: number
  itemsLength: number
}

export type State = {
  patient: {
    loading: boolean
    options: DataOptions
    pagination: Pagination
    count: number
    contents: Entry[]
    selected: Entry[]
  }
  sample: {
    loading: boolean
    options: DataOptions
    pagination: Pagination
    count: number
    contents: Entry[]
    selected: Entry[]
  }
}

export const state = (): State => ({
  patient: {
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 30,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      mustSort: false,
      multiSort: true,
    },
    pagination: {
      page: 1,
      itemsPerPage: 30,
      pageStart: 0,
      pageStop: 0,
      pageCount: 0,
      itemsLength: 0,
    },
    count: 0,
    contents: [],
    selected: [],
  },
  sample: {
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 30,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      mustSort: false,
      multiSort: true,
    },
    pagination: {
      page: 1,
      itemsPerPage: 30,
      pageStart: 0,
      pageStop: 0,
      pageCount: 0,
      itemsLength: 0,
    },
    count: 0,
    contents: [],
    selected: [],
  },
})

export const mutations: MutationTree<State> = {
  setLoading(
    state,
    payload: {
      viewType: keyof State
      value: boolean
    }
  ) {
    state[payload.viewType].loading = payload.value
  },

  setOptions(
    state,
    payload: {
      viewType: keyof State
      value: DataOptions
    }
  ) {
    state[payload.viewType].options = payload.value
  },

  setPagination(
    state,
    payload: {
      viewType: keyof State
      value: Pagination
    }
  ) {
    state[payload.viewType].pagination = payload.value
  },

  setSelected(
    state,
    payload: {
      viewType: keyof State
      value: Entry[]
    }
  ) {
    state[payload.viewType].selected = payload.value
  },

  setEntries(
    state,
    payload: {
      viewType: keyof State
      value: Entry[]
    }
  ) {
    state[payload.viewType].contents = payload.value
  },

  setCount(
    state,
    payload: {
      viewType: keyof State
      value: number
    }
  ) {
    state[payload.viewType].count = payload.value
  },
}

const arrayToString = (arr: Array<string | number>) => {
  return Array.from(new Set(arr)).sort().join(', ')
}

export const actions: ActionTree<State, RootState> = {
  async updateEntries(
    { commit, state, rootState },
    payload: { viewType: keyof State; axios: NuxtAxiosInstance }
  ) {
    const fetchedEntries = await fetchEntries(
      payload.viewType,
      payload.axios,
      state[payload.viewType].options,
      state[payload.viewType].pagination,
      rootState.filter
    )

    const entries: Entry[] = []

    if (payload.viewType === 'sample') {
      const typedFetchedEntries = fetchedEntries as SampleEntry[]
      for (const fetchedEntry of typedFetchedEntries) {
        const entry: Entry = {
          projectID: arrayToString(
            fetchedEntry.projects.map((project) => project.projectID)
          ),
          projectName: arrayToString(
            fetchedEntry.projects.map((project) => project.projectName)
          ),
          projectPatientID: arrayToString(fetchedEntry.projectPatientIDs),
          patientID: fetchedEntry.patientID,
          sex: fetchedEntry.sex,
          age: fetchedEntry.age,
          disease: fetchedEntry.disease,
          sampleID: fetchedEntry.sampleID,
          samplingDate: fetchedEntry.samplingDate,
        }
        for (const dataType of fetchedEntry.dataTypes) {
          entry[dataType.name] = true
          for (const [key, value] of Object.entries(dataType)) {
            if (key !== 'name') {
              entry[`${dataType.name}_${key}`] = value
            }
          }
        }
        entries.push(entry)
      }
    } else if (payload.viewType === 'patient') {
      const typedFetchedEntries = fetchedEntries as PatientEntry[]
      for (const fetchedEntry of typedFetchedEntries) {
        const entry: Entry = {
          projectID: arrayToString(
            fetchedEntry.projects.map((project) => project.projectID)
          ),
          projectName: arrayToString(
            fetchedEntry.projects.map((project) => project.projectName)
          ),
          projectPatientID: arrayToString(fetchedEntry.projectPatientIDs),
          patientID: fetchedEntry.patientID,
          sex: arrayToString(fetchedEntry.samples.map((sample) => sample.sex)),
          age: arrayToString(fetchedEntry.samples.map((sample) => sample.age)),
          disease: arrayToString(
            fetchedEntry.samples.map((sample) => sample.disease)
          ),
          sampleID: arrayToString(
            fetchedEntry.samples.map((sample) => sample.sampleID)
          ),
          samplingDate: arrayToString(
            fetchedEntry.samples.map((sample) => sample.samplingDate)
          ),
        }

        for (const dataTypes of fetchedEntry.samples.map(
          (sample) => sample.dataTypes
        )) {
          for (const dataType of dataTypes) {
            entry[dataType.name] = true
            for (const [key, value] of Object.entries(dataType)) {
              if (key !== 'name') {
                entry[`${dataType.name}_${key}`] = value
              }
            }
          }
        }
        entries.push(entry)
      }
    }

    commit('setEntries', { viewType: payload.viewType, value: entries })
  },

  async updateEntryCount(
    { commit, rootState },
    payload: { viewType: keyof State; axios: NuxtAxiosInstance }
  ) {
    const sampleCount = await fetchCount(
      payload.viewType,
      'sample',
      payload.axios,
      rootState.filter
    )
    const patientCount = await fetchCount(
      payload.viewType,
      'patient',
      payload.axios,
      rootState.filter
    )

    commit('setCount', {
      viewType: payload.viewType,
      value: payload.viewType === 'sample' ? sampleCount : patientCount,
    })
    commit(
      'filter/setCount',
      {
        viewType: payload.viewType,
        sample: sampleCount,
        patient: patientCount,
      },
      { root: true }
    )
  },
}
