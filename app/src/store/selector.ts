import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { DataTableHeader } from 'vuetify'
import { fetchDataTypeToMetadataFields } from '@/utils/dataFetcher'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { RootState } from '@/store'

const requiredHeaders: DataTableHeader[] = [
  {
    text: 'Project ID',
    value: 'projectID',
    align: 'start',
    sortable: true,
    width: 125,
  },
  {
    text: 'Project Name',
    value: 'projectName',
    align: 'start',
    sortable: true,
    width: 105,
  },
  {
    text: 'Project Patient ID',
    value: 'projectPatientID',
    align: 'start',
    sortable: true,
    width: 105,
  },
  {
    text: 'Patient ID',
    value: 'patientID',
    align: 'start',
    sortable: true,
    width: 105,
  },
  {
    text: 'Sex',
    value: 'sex',
    align: 'start',
    sortable: true,
    width: 75,
  },
  {
    text: 'Age',
    value: 'age',
    align: 'start',
    sortable: true,
    width: 75,
  },
  {
    text: 'Disease',
    value: 'disease',
    align: 'start',
    sortable: true,
    width: 105,
  },
  {
    text: 'Sample ID',
    value: 'sampleID',
    align: 'start',
    sortable: true,
    width: 105,
  },
  {
    text: 'Sampling Date',
    value: 'samplingDate',
    align: 'start',
    sortable: true,
    width: 105,
  },
]

export const requiredFields = requiredHeaders.map((field) => field.value)

export type TreeviewItem = {
  id: string
  name: string
  children?: {
    id: string
    name: string
  }[]
}

export type State = {
  sample: {
    requiredFields: {
      contents: DataTableHeader[]
      selected: DataTableHeader[]
    }
    dataTypeFields: {
      contents: TreeviewItem[]
      selected: TreeviewItem[]
      opened: TreeviewItem[]
    }
  }
  patient: {
    requiredFields: {
      contents: DataTableHeader[]
      selected: DataTableHeader[]
    }
    dataTypeFields: {
      contents: TreeviewItem[]
      selected: TreeviewItem[]
      opened: TreeviewItem[]
    }
  }
}

export const state = (): State => ({
  sample: {
    requiredFields: {
      contents: requiredHeaders,
      selected: [],
    },
    dataTypeFields: {
      contents: [],
      selected: [],
      opened: [],
    },
  },
  patient: {
    requiredFields: {
      contents: requiredHeaders,
      selected: [],
    },
    dataTypeFields: {
      contents: [],
      selected: [],
      opened: [],
    },
  },
})

export const getters: GetterTree<State, RootState> = {
  // dataTableHeaders(state) {},
}

export const mutations: MutationTree<State> = {
  setRequiredFields(
    state,
    payload: {
      viewType: keyof State
      value: DataTableHeader[]
    }
  ) {
    state[payload.viewType].requiredFields.selected = payload.value
  },

  setDataTypeFields(
    state,
    payload: {
      viewType: keyof State
      type: 'selected' | 'opened'
      value: TreeviewItem[]
    }
  ) {
    state[payload.viewType].dataTypeFields[payload.type] = payload.value
  },

  expandTreeview(state, payload: { viewType: keyof State }) {
    state[payload.viewType].dataTypeFields.opened =
      state[payload.viewType].dataTypeFields.contents
  },

  collapseTreeview(state, payload: { viewType: keyof State }) {
    state[payload.viewType].dataTypeFields.opened = []
  },

  resetSelector(state, payload: { viewType: keyof State }) {
    state[payload.viewType].requiredFields.selected = []
    state[payload.viewType].dataTypeFields.selected = []
    state[payload.viewType].dataTypeFields.opened = []
  },

  setInitialState(
    state,
    payload: {
      viewType: keyof State
      dataTypeField: TreeviewItem[]
    }
  ) {
    state[payload.viewType].dataTypeFields.contents = payload.dataTypeField
  },
}

export const actions: ActionTree<State, RootState> = {
  async initialize(
    { commit },
    payload: { viewType: keyof State; axios: NuxtAxiosInstance }
  ) {
    const dataTypeToMetadataFields = await fetchDataTypeToMetadataFields(
      payload.axios
    )
    const dataTypeField = Object.entries(dataTypeToMetadataFields).map(
      ([dataType, metadataFields]) => ({
        id: dataType,
        name: dataType,
        children: metadataFields.map((metadataField) => ({
          id: dataType + '_' + metadataField,
          name: metadataField,
        })),
      })
    )

    commit('setInitialState', {
      viewType: payload.viewType,
      dataTypeField,
    })
  },
}
