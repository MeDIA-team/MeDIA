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
  },
  updateSelectedRequiredFields({ commit }, data) {
    commit("setSelectedRequiredFields", data)
  },
  updateSelectedDataTypesFields({ commit }, data) {
    commit("setSelectedDataTypesFields", data)
  }
}
