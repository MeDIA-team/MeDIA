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
      selected: requiredHeaders,
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
      selected: requiredHeaders,
    },
    dataTypeFields: {
      contents: [],
      selected: [],
      opened: [],
    },
  },
})

export const getters: GetterTree<State, RootState> = {
  headers: (state) => (payload: { viewType: keyof State }) => {
    const dataTypeHeaders: DataTableHeader[] = []
    for (const dataTypeField of state[payload.viewType].dataTypeFields
      .selected) {
      const dataTypeHeader: DataTableHeader = {
        text: dataTypeField.id.includes('_')
          ? dataTypeField.id.replace('_', ': ')
          : dataTypeField.id,
        value: dataTypeField.id,
        align: dataTypeField.id.includes('_') ? 'start' : 'center',
        sortable: dataTypeField.id.includes('_'),
      }
      dataTypeHeaders.push(dataTypeHeader)
    }
    const headers = [
      ...state[payload.viewType].requiredFields.selected,
      ...dataTypeHeaders.sort((a, b) =>
        a.value > b.value ? 1 : b.value > a.value ? -1 : 0
      ),
    ]
    return headers
  },

  requiredFieldsSelected: (state) => (payload: { viewType: keyof State }) => {
    return state[payload.viewType].requiredFields.selected.map(
      (header) => header.value
    )
  },

  parentDataTypes: (state) => (payload: { viewType: keyof State }) => {
    return state[payload.viewType].dataTypeFields.contents.map(
      (field) => `item.${field.id}`
    )
  },

  copyableHeaders: (state) => (payload: { viewType: keyof State }) => {
    const headers = requiredHeaders.map((header) => `item.${header.value}`)
    for (const dataTypeField of state[
      payload.viewType
    ].dataTypeFields.contents.map((field) => field.id)) {
      if (dataTypeField.includes('_')) {
        headers.push(`item.dataTypeField`)
      }
    }
    return headers
  },
}

export const mutations: MutationTree<State> = {
  setRequiredFields(
    state,
    payload: {
      viewType: keyof State
      value: string[]
    }
  ) {
    const selected = []
    for (const val of payload.value) {
      for (const header of requiredHeaders) {
        if (val === header.value) {
          selected.push(header)
          break
        }
      }
    }
    state[payload.viewType].requiredFields.selected = selected
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
    state[payload.viewType].requiredFields.selected = requiredHeaders
    state[payload.viewType].dataTypeFields.selected =
      state[payload.viewType].dataTypeFields.contents
  },

  setInitialState(
    state,
    payload: {
      viewType: keyof State
      dataTypeField: TreeviewItem[]
    }
  ) {
    state[payload.viewType].dataTypeFields.contents = payload.dataTypeField
    state[payload.viewType].dataTypeFields.selected = payload.dataTypeField
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
