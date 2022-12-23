import Vue from 'vue'
import { ActionTree, MutationTree } from 'vuex'

import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { RootState } from '@/store'
import { fetchUniqueValues } from '@/utils/dataFetcher'

export interface CheckboxFieldValue {
  contents: string[]
  selected: string[]
}

export interface ChipFieldValue {
  contents: string[]
  selected: string[]
}

export interface TextFieldValue {
  bottom: number | string | null
  upper: number | string | null
}

type FieldValue = CheckboxFieldValue | ChipFieldValue | TextFieldValue

export type State = {
  sample: {
    fields: Record<string, FieldValue>
    counts: {
      sample: {
        filtered: number
        total: number
      }
      patient: {
        filtered: number
        total: number
      }
    }
  }
  patient: {
    fields: Record<string, FieldValue>
    counts: {
      sample: {
        filtered: number
        total: number
      }
      patient: {
        filtered: number
        total: number
      }
    }
  }
}

export const state = (): State => ({
  sample: {
    fields: {},
    counts: {
      sample: {
        filtered: 0,
        total: 0,
      },
      patient: {
        filtered: 0,
        total: 0,
      },
    },
  },
  patient: {
    fields: {},
    counts: {
      sample: {
        filtered: 0,
        total: 0,
      },
      patient: {
        filtered: 0,
        total: 0,
      },
    },
  },
})

export const mutations: MutationTree<State> = {
  initializeField(
    state,
    payload: {
      viewType: keyof State
      id: string
      formType: 'checkbox' | 'chip' | 'text'
    }
  ) {
    if (payload.formType === 'text') {
      Vue.set(state[payload.viewType].fields, payload.id, {
        bottom: null,
        upper: null,
      })
    } else {
      Vue.set(state[payload.viewType].fields, payload.id, {
        contents: [],
        selected: [],
      })
    }
  },

  setValue(
    state,
    payload: {
      viewType: keyof State
      id: string
      formType: 'checkbox' | 'chip' | 'text'
      value: Partial<FieldValue>
    }
  ) {
    if (payload.formType === 'text') {
      if ('bottom' in payload.value) {
        Vue.set(
          state[payload.viewType].fields[payload.id],
          'bottom',
          payload.value.bottom
        )
      }
      if ('upper' in payload.value) {
        Vue.set(
          state[payload.viewType].fields[payload.id],
          'upper',
          payload.value.upper
        )
      }
    } else {
      if ('contents' in payload.value && payload.value.contents) {
        Vue.set(
          state[payload.viewType].fields[payload.id],
          'contents',
          payload.value.contents
        )
      }
      if ('selected' in payload.value && payload.value.selected) {
        Vue.set(
          state[payload.viewType].fields[payload.id],
          'selected',
          payload.value.selected
        )
      }
    }
  },

  setCount(
    state,
    payload: {
      viewType: keyof State
      countCategory: 'sample' | 'patient'
      countType: 'total' | 'filtered'
      value: number
    }
  ) {
    Vue.set(
      state[payload.viewType].counts[payload.countCategory],
      payload.countType,
      payload.value
    )
  },

  reset(state, payload: { viewType: keyof State }) {
    for (const key of Object.keys(state[payload.viewType].fields)) {
      if ('selected' in state[payload.viewType].fields[key]) {
        Vue.set(state[payload.viewType].fields[key], 'selected', [])
      } else {
        Vue.set(state[payload.viewType].fields[key], 'bottom', null)
        Vue.set(state[payload.viewType].fields[key], 'upper', null)
      }
    }
  },
}

export const actions: ActionTree<State, RootState> = {
  async initialize(
    { commit },
    payload: {
      viewType: keyof State
      dataConfig: Config
      axios: NuxtAxiosInstance
    }
  ) {
    for (const field of payload.dataConfig.filter.fields) {
      commit('initializeField', {
        viewType: payload.viewType,
        id: field.id,
        formType: field.form.type,
      })
      const value: Partial<FieldValue> = {}
      if (field.form.type === 'text') {
        if (field.type === 'integer') {
          ;(value as TextFieldValue).bottom = null
          ;(value as TextFieldValue).upper = null
        } else if (field.type === 'date') {
          ;(value as TextFieldValue).bottom = null
          ;(value as TextFieldValue).upper = null
        }
      } else {
        ;(value as CheckboxFieldValue | ChipFieldValue).contents =
          await fetchUniqueValues(payload.axios, field.id)
      }
      commit('setValue', {
        viewType: payload.viewType,
        id: field.id,
        formType: field.form.type,
        value,
      })
      if (field.id === 'sampleId') {
        commit('setCount', {
          viewType: payload.viewType,
          countCategory: 'sample',
          countType: 'total',
          value:
            (value as CheckboxFieldValue | ChipFieldValue).contents.length || 0,
        })
      } else if (field.id === 'patientId') {
        commit('setCount', {
          viewType: payload.viewType,
          countCategory: 'patient',
          countType: 'total',
          value:
            (value as CheckboxFieldValue | ChipFieldValue).contents.length || 0,
        })
      }
    }
  },

  setSelectedIds({ commit, rootState }, payload: { viewType: keyof State }) {
    // sample view で呼び出されたら、
    // patient view の selected entry における patientId を
    // sample view の filter patientId.selected に set する
    //
    // patient view で呼び出されたら、
    // sample view の selected entry における sampleId を
    // patient view の filter sampleId.selected に set する
    if (payload.viewType === 'sample') {
      const selectedPatientIds = rootState.entry.patient.selected.map(
        (entry) => entry.patientId
      )
      if (selectedPatientIds.length) {
        commit('setValue', {
          viewType: 'sample',
          id: 'patientId',
          formType: 'chip',
          value: {
            selected: selectedPatientIds,
          },
        })
      }
    } else if (payload.viewType === 'patient') {
      const selectedSampleIds = rootState.entry.sample.selected.map(
        (entry) => entry.sampleId
      )
      if (selectedSampleIds.length) {
        commit('setValue', {
          viewType: 'patient',
          id: 'sampleId',
          formType: 'chip',
          value: {
            selected: selectedSampleIds,
          },
        })
      }
    }
    Promise.resolve()
  },
}
