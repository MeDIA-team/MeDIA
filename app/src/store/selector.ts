import Vue from 'vue'
import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { fetchDataTypeToMetadataFields } from '@/utils/dataFetcher'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

export type TreeviewItem = {
  id: string
  name: string
  children?: TreeviewItem[]
}

export type State = {
  sample: {
    requiredFields: {
      contents: Array<CheckboxField | ChipField | TextField>
      selected: string[]
    }
    dataTypeFields: {
      contents: TreeviewItem[]
      selected: string[]
      opened: string[]
    }
    dataTypes: string[]
  }
  patient: {
    requiredFields: {
      contents: Array<CheckboxField | ChipField | TextField>
      selected: string[]
    }
    dataTypeFields: {
      contents: TreeviewItem[]
      selected: string[]
      opened: string[]
    }
    dataTypes: string[]
  }
}

export const state = (): State => ({
  sample: {
    requiredFields: {
      contents: [],
      selected: [],
    },
    dataTypeFields: {
      contents: [],
      selected: [],
      opened: [],
    },
    dataTypes: [],
  },
  patient: {
    requiredFields: {
      contents: [],
      selected: [],
    },
    dataTypeFields: {
      contents: [],
      selected: [],
      opened: [],
    },
    dataTypes: [],
  },
})

export const getters: GetterTree<State, RootState> = {
  requiredFieldHeaders:
    (state) => (payload: { viewType: keyof State; dataConfig: Config }) => {
      const orderedIds = state[payload.viewType].requiredFields.contents
        .map((header) => header.id)
        .filter((id) =>
          state[payload.viewType].requiredFields.selected.includes(id)
        )
      return orderedIds
        .map(
          (id) =>
            payload.dataConfig.filter.fields.filter(
              (field) => field.id === id
            )[0]
        )
        .map((field) => ({
          text: field.label,
          value: field.id,
          align: 'start',
          sortable: true,
        }))
    },

  dataTypeFieldHeaders: (state) => (payload: { viewType: keyof State }) => {
    const ids: string[] = []
    const orderedIds = extractTreeviewLeafItemIds(
      state[payload.viewType].dataTypeFields.contents
    )
    const orderedFilteredIds = orderedIds.filter((id) =>
      state[payload.viewType].dataTypeFields.selected.includes(id)
    )
    for (const id of orderedFilteredIds) {
      const parent = id.split('_')[0]
      if (!ids.includes(parent)) {
        ids.push(parent)
      }
      if (!ids.includes(id)) {
        ids.push(id)
      }
    }
    return ids
      .map((id) => ({
        text: id.includes('_') ? id.replace('_', ': ') : id,
        value: id,
        align: id.includes('_') ? 'start' : 'center',
        sortable: id.includes('_'),
      }))
      .sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0))
  },

  parentDataTypes: (state) => (payload: { viewType: keyof State }) => {
    return state[payload.viewType].dataTypes.map(
      (dataType) => `item.${dataType}`
    )
  },

  copyableHeaders: (state) => (payload: { viewType: keyof State }) => {
    const headers = state[payload.viewType].requiredFields.contents.map(
      (field) => `item.${field.id}`
    )
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
  setValue(
    state,
    payload: {
      viewType: keyof State
      fieldType: keyof State['sample']
      valueType: keyof State['sample']['dataTypeFields']
      value:
        | string[]
        | Array<CheckboxField | ChipField | TextField>
        | TreeviewItem[]
    }
  ) {
    Vue.set(
      state[payload.viewType][payload.fieldType],
      payload.valueType,
      payload.value
    )
  },

  reset(state, payload: { viewType: keyof State }) {
    Vue.set(
      state[payload.viewType].requiredFields,
      'selected',
      state[payload.viewType].requiredFields.contents.map((field) => field.id)
    )
    Vue.set(
      state[payload.viewType].dataTypeFields,
      'selected',
      extractTreeviewLeafItemIds(
        state[payload.viewType].dataTypeFields.contents
      )
    )
  },

  expandTreeview(state, payload: { viewType: keyof State }) {
    Vue.set(
      state[payload.viewType].dataTypeFields,
      'opened',
      extractTreeviewParentItemIds(
        state[payload.viewType].dataTypeFields.contents
      )
    )
  },

  collapseTreeview(state, payload: { viewType: keyof State }) {
    Vue.set(state[payload.viewType].dataTypeFields, 'opened', [])
  },

  setDataTypes(
    state,
    payload: {
      viewType: keyof State
      value: string[]
    }
  ) {
    Vue.set(state[payload.viewType], 'dataTypes', payload.value)
  },
}

const generateTreeviewItems = (
  fields: SelectorField[],
  dataTypeToMetadataFields: Record<string, string[]>
): TreeviewItem[] => {
  return fields.map((field) => {
    if ('child' in field) {
      return {
        id: field.id,
        name: field.label,
        children: generateTreeviewItems(
          field?.child || [],
          dataTypeToMetadataFields
        ),
      }
    } else {
      return {
        id: field.id,
        name: field.label,
        children: dataTypeToMetadataFields[field.id].map((metadataField) => ({
          id: field.id + '_' + metadataField,
          name: metadataField,
        })),
      }
    }
  })
}

const extractTreeviewLeafItemIds = (
  treeviewItems: TreeviewItem[]
): string[] => {
  return treeviewItems.flatMap((treeviewItem) => {
    if ('children' in treeviewItem) {
      return [...extractTreeviewLeafItemIds(treeviewItem.children || [])]
    } else {
      return [treeviewItem.id]
    }
  })
}

const extractTreeviewParentItemIds = (
  treeviewItems: TreeviewItem[]
): string[] => {
  return treeviewItems.flatMap((treeviewItem) => {
    if ('children' in treeviewItem) {
      return [
        treeviewItem.id,
        ...extractTreeviewParentItemIds(treeviewItem.children || []),
      ]
    } else {
      return []
    }
  })
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
    const requiredFields = payload.dataConfig.filter.fields.filter(
      (field) => field.id !== 'dataType'
    )
    commit('setValue', {
      viewType: payload.viewType,
      fieldType: 'requiredFields',
      valueType: 'contents',
      value: requiredFields,
    })
    commit('setValue', {
      viewType: payload.viewType,
      fieldType: 'requiredFields',
      valueType: 'selected',
      value: requiredFields.map((field) => field.id),
    })
    const dataTypeToMetadataFields = await fetchDataTypeToMetadataFields(
      payload.axios,
      requiredFields.map((field) => field.id)
    )
    const treeviewItems = generateTreeviewItems(
      payload.dataConfig.selector.dataType,
      dataTypeToMetadataFields
    )
    commit('setValue', {
      viewType: payload.viewType,
      fieldType: 'dataTypeFields',
      valueType: 'contents',
      value: treeviewItems,
    })
    commit('setValue', {
      viewType: payload.viewType,
      fieldType: 'dataTypeFields',
      valueType: 'selected',
      value: extractTreeviewLeafItemIds(treeviewItems),
    })
    commit('setDataTypes', {
      viewType: payload.viewType,
      value: Object.keys(dataTypeToMetadataFields),
    })
  },
}
