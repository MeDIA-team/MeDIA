import {
  fetchProjects,
  fetchSexes,
  fetchDataTypes,
  fetchDataTypesMetadataFields,
  fetchTotalEntriesNum
} from "~/util/data-fetcher"

export const state = () => ({
  projects: [],
  sexes: [],
  dataTypes: [],
  dataTypesMetadataFields: {},
  totalEntryNum: null
})

export const getters = {}

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
    const projects = await fetchProjects(this.$axios)
    commit("setProjects", projects)
  },
  async initSexes({ commit }) {
    const sexes = await fetchSexes(this.$axios)
    commit("setSexes", sexes)
  },
  async initDataTypes({ commit }) {
    const dataTypes = await fetchDataTypes(this.$axios)
    commit("setDataTypes", dataTypes)
  },
  async initDataTypesMetadataFields({ commit }) {
    const dataTypesMetadataFields = await fetchDataTypesMetadataFields(
      this.$axios
    )
    commit("setDataTypesMetadataFields", dataTypesMetadataFields)
  },
  async initTotalEntryNum({ commit }) {
    const totalEntryNum = await fetchTotalEntriesNum(this.$axios)
    commit("setTotalEntryNum", totalEntryNum)
  }
}
