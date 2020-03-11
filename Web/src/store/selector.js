export const state = () => ({
  selectedDefaultColumns: [
    "Project Name",
    "Project ID",
    "Patient ID",
    "Sex",
    "Age",
    "Sample ID",
    "Sampling Date"
  ],
  selectedDataTypesColumns: []
})

export const getters = {}

export const mutations = {
  setSelectedDefaultColumns(state, data) {
    state.selectedDefaultColumns = data
  },
  setSelectedDataTypesColumns(state, data) {
    state.selectedDataTypesColumns = data
  }
}

export const actions = {
  updateSelectedDefaultColumns({ commit }, data) {
    commit("setSelectedDefaultColumns", data)
  },
  updateSelectedDataTypesColumns({ commit }, data) {
    commit("setSelectedDataTypesColumns", data)
  }
}
