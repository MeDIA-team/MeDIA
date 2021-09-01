/* eslint-disable @typescript-eslint/ban-ts-comment */
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

  dataTypeFieldHeaders:
    (state) => (payload: { viewType: keyof State; dataConfig: Config }) => {
      const ids: string[] = []
      const orderedIds = extractTreeviewLeafItemIds(
        state[payload.viewType].dataTypeFields.contents
      )
      const orderedFilteredIds = orderedIds.filter((id) =>
        state[payload.viewType].dataTypeFields.selected.includes(id)
      )
      for (const id of orderedFilteredIds) {
        if (id.includes(': dataAvailability')) {
          ids.push(id.split(': ')[0])
        } else {
          ids.push(id)
        }
      }
      return ids.map((id) => ({
        text: id,
        value: id,
        align: id.includes(': ') ? 'start' : 'center',
        sortable: id.includes(': '),
      }))
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
    for (const dataTypeFieldId of extractTreeviewLeafItemIds(
      state[payload.viewType].dataTypeFields.contents
    )) {
      if (!dataTypeFieldId.includes(': dataAvailability')) {
        headers.push(`item.${dataTypeFieldId}`)
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
      ).filter((id) => id.includes(': dataAvailability'))
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
  dataTypeToMetadataFields: Record<string, string[]>,
  dataConfig: Config
): TreeviewItem[] => {
  return fields.map((field) => {
    if ('child' in field) {
      return {
        id: field.id,
        name: field.label,
        children: generateTreeviewItems(
          field?.child || [],
          dataTypeToMetadataFields,
          dataConfig
        ),
      }
    } else {
      const children = dataTypeToMetadataFields[field.id]
        ? dataTypeToMetadataFields[field.id].map((metadataField) => ({
            id: field.id + ': ' + metadataField,
            name: metadataField,
          }))
        : []
      return {
        id: field.id,
        name: field.label,
        children: [
          {
            id: field.id + ': dataAvailability',
            name: dataConfig.selector.dataAvailabilityLabel,
          },
          ...children,
        ],
      }
    }
  })
}

const extractTreeviewLeafItemIds = (
  treeviewItems: TreeviewItem[]
): string[] => {
  return treeviewItems.flatMap((treeviewItem) => {
    // @ts-ignore
    if ('children' in treeviewItem && treeviewItem.children.length > 0) {
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
      dataTypeToMetadataFields,
      payload.dataConfig
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
      value: extractTreeviewLeafItemIds(treeviewItems).filter((id) =>
        id.includes(': dataAvailability')
      ),
    })
    commit('setDataTypes', {
      viewType: payload.viewType,
      value: Object.keys(dataTypeToMetadataFields),
    })
  },
}
