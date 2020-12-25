import { ActionTree, MutationTree } from 'vuex'
import { fetchUniqueValues } from '@/utils/dataFetcher'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { RootState } from '@/store'

type TextBoxFieldType = {
  bottom: number | string
  upper: number | string
}

type CheckBoxFieldType = {
  contents: string[]
  selected: string[]
}

type ChipFieldType = CheckBoxFieldType

type FilterType = {
  projects: CheckBoxFieldType
  patientIDs: ChipFieldType
  projectPatientIDs: ChipFieldType
  sexes: CheckBoxFieldType
  age: TextBoxFieldType
  diseases: CheckBoxFieldType
  sampleIDs: ChipFieldType
  samplingDate: TextBoxFieldType
  dataTypes: ChipFieldType
}

export type State = {
  sample: FilterType & {
    count: {
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
  patient: FilterType & {
    count: {
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
    projects: {
      contents: [],
      selected: [],
    },
    patientIDs: {
      contents: [],
      selected: [],
    },
    projectPatientIDs: {
      contents: [],
      selected: [],
    },
    sexes: {
      contents: [],
      selected: [],
    },
    age: {
      bottom: '',
      upper: '',
    },
    diseases: {
      contents: [],
      selected: [],
    },
    sampleIDs: {
      contents: [],
      selected: [],
    },
    samplingDate: {
      bottom: '',
      upper: '',
    },
    dataTypes: {
      contents: [],
      selected: [],
    },
    count: {
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
    projects: {
      contents: [],
      selected: [],
    },
    patientIDs: {
      contents: [],
      selected: [],
    },
    projectPatientIDs: {
      contents: [],
      selected: [],
    },
    sexes: {
      contents: [],
      selected: [],
    },
    age: {
      bottom: '',
      upper: '',
    },
    diseases: {
      contents: [],
      selected: [],
    },
    sampleIDs: {
      contents: [],
      selected: [],
    },
    samplingDate: {
      bottom: '',
      upper: '',
    },
    dataTypes: {
      contents: [],
      selected: [],
    },
    count: {
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
  setFilterTextField(
    state,
    payload: {
      viewType: keyof State
      value: string | number
      contentKey: 'age' | 'samplingDate'
      direction: 'bottom' | 'upper'
    }
  ) {
    state[payload.viewType][payload.contentKey][payload.direction] =
      payload.value
  },

  setFilterCheckBoxField(
    state,
    payload: {
      viewType: keyof State
      value: string[]
      contentKey: 'projects' | 'sexes' | 'diseases'
    }
  ) {
    state[payload.viewType][payload.contentKey].selected = payload.value
  },

  setFilterChipField(
    state,
    payload: {
      viewType: keyof State
      value: string[]
      contentKey: 'patientIDs' | 'projectPatientIDs' | 'sampleIDs' | 'dataTypes'
    }
  ) {
    state[payload.viewType][payload.contentKey].selected = payload.value
  },

  resetFilter(state, payload: { viewType: keyof State }) {
    state[payload.viewType].projects.selected = []
    state[payload.viewType].patientIDs.selected = []
    state[payload.viewType].projectPatientIDs.selected = []
    state[payload.viewType].sexes.selected = []
    state[payload.viewType].age.bottom = ''
    state[payload.viewType].age.upper = ''
    state[payload.viewType].diseases.selected = []
    state[payload.viewType].sampleIDs.selected = []
    state[payload.viewType].samplingDate.bottom = ''
    state[payload.viewType].samplingDate.upper = ''
    state[payload.viewType].dataTypes.selected = []
  },

  setInitialState(
    state,
    payload: {
      viewType: keyof State
      projects: string[]
      patientIDs: string[]
      projectPatientIDs: string[]
      sexes: string[]
      diseases: string[]
      sampleIDs: string[]
      dataTypes: string[]
    }
  ) {
    state[payload.viewType].projects.contents = payload.projects
    state[payload.viewType].patientIDs.contents = payload.patientIDs
    state[payload.viewType].projectPatientIDs.contents =
      payload.projectPatientIDs
    state[payload.viewType].sexes.contents = payload.sexes
    state[payload.viewType].diseases.contents = payload.diseases
    state[payload.viewType].sampleIDs.contents = payload.sampleIDs
    state[payload.viewType].dataTypes.contents = payload.dataTypes

    state[payload.viewType].count.sample.total = payload.sampleIDs.length
    state[payload.viewType].count.patient.total = payload.patientIDs.length
  },
}

export const actions: ActionTree<State, RootState> = {
  async initialize(
    { commit },
    payload: { viewType: keyof State; axios: NuxtAxiosInstance }
  ) {
    const fieldNames = [
      'projectName',
      'patientID',
      'projectPatientID',
      'sex',
      'disease',
      'sampleID',
      'dataType',
    ]
    const queue = fieldNames.map((field) =>
      fetchUniqueValues(payload.axios, field)
    )
    const results = await Promise.all(queue)

    commit('setInitialState', {
      viewType: payload.viewType,
      projects: results[0],
      patientIDs: results[1],
      projectPatientIDs: results[2],
      sexes: results[3],
      diseases: results[4],
      sampleIDs: results[5],
      dataTypes: results[6],
    })
  },
}
