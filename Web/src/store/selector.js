export const state = () => ({
  selectedRequiredFields: [],
  selectedDataTypeFields: [],
  treeviewOpen: []
})

export const getters = {
  treeviewItems(state, getters, rootState, rootGetters) {
    return rootState.init.dataTypes.map((dataType) => {
      return {
        id: dataType,
        name: dataType,
        children: rootState.init.dataTypeFields[dataType].map((field) => {
          return {
            id: dataType + "_" + field,
            name: field
          }
        })
      }
    })
  }
}

export const mutations = {
  setSelectedRequiredFields(state, data) {
    state.selectedRequiredFields = data
  },
  setSelectedDataTypesFields(state, data) {
    state.selectedDataTypeFields = data
  },
  setTreeviewOpen(state, data) {
    state.treeviewOpen = data
  }
}

export const actions = {
  initialize({ commit, rootState }) {
    commit(
      "setSelectedRequiredFields",
      rootState.const.requiredFields
        .map((item) => item.key)
        .filter((key) => key !== "dataType")
    )
    commit("setSelectedDataTypesFields", rootState.init.dataTypes)
  },
  updateSelectedRequiredFields({ commit, rootState }, data) {
    const sortedData = rootState.const.requiredFields
      .filter((field) => data.includes(field.key))
      .map((field) => field.key)
    commit("setSelectedRequiredFields", sortedData)
  },
  updateSelectedDataTypesFields({ commit, rootState }, data) {
    const sortedData = []
    for (const dataType of rootState.init.dataTypes) {
      if (data.includes(dataType)) {
        sortedData.push(dataType)
      }
      for (const field of rootState.init.dataTypeFields[dataType]) {
        if (data.includes(`${dataType}_${field}`)) {
          sortedData.push(`${dataType}_${field}`)
        }
      }
    }
    commit("setSelectedDataTypesFields", sortedData)
  },
  updateTreeviewOpen({ commit }, data) {
    commit("setTreeviewOpen", data)
  }
}
