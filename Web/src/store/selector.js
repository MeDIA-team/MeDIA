export const state = () => ({
  selectedRequiredFields: [],
  selectedDataTypeFields: []
})

export const mutations = {
  setSelectedRequiredFields(state, data) {
    state.selectedRequiredFields = data
  },
  setSelectedDataTypesFields(state, data) {
    state.selectedDataTypeFields = data
  }
}

export const actions = {
  initialize({ commit, rootState }) {
    commit(
      "setSelectedRequiredFields",
      rootState.const.requiredFields.map((item) => item.key)
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
  }
}
