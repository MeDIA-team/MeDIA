export const state = () => ({
  projects: [],
  sexes: [],
  dataTypes: [],
  dataTypesMetadataFields: {},
  totalEntryNum: null
})

export const mutations = {
  setProjects(state, data) {
    state.projects = data
  },
  setSexes(state, data) {
    state.sexes = data
  },
  setDataTypes(state, data) {
    state.dataTypes = data
  },
  setDataTypesMetadataFields(state, data) {
    state.dataTypesMetadataFields = data
  },
  setTotalEntryNum(state, data) {
    state.totalEntryNum = data
  }
}

export const actions = {
  async initProjects({ commit }) {
    const projects = await this.$dataFetcher.fetchUniqueValues("projectName")
    commit("setProjects", projects)
  },
  async initSexes({ commit }) {
    const sexes = await this.$dataFetcher.fetchUniqueValues("sex")
    commit("setSexes", sexes)
  },
  async initDataTypes({ commit }) {
    const dataTypes = await this.$dataFetcher.fetchUniqueValues("dataType")
    dataTypes.sort()
    commit("setDataTypes", dataTypes)
  },
  async initDataTypesMetadataFields({ commit }) {
    const dataTypesMetadataFields = await this.$dataFetcher.fetchDataTypesMetadataFields()
    Object.keys(dataTypesMetadataFields).forEach((key) => {
      dataTypesMetadataFields[key].sort()
    })
    commit("setDataTypesMetadataFields", dataTypesMetadataFields)
  },
  async initTotalEntryNum({ commit }) {
    const totalEntryNum = await this.$dataFetcher.fetchTotalEntriesNum()
    commit("setTotalEntryNum", totalEntryNum)
  }
}
