import { fetchEntriesNum, fetchEntries } from "~/util/data-fetcher"

export const state = () => ({
  headers: [],
  entries: [],
  entryNum: null,
  selectedEntries: []
})

export const getters = {}

export const mutations = {
  setHeaders(state, data) {
    state.headers = data
  },
  setEntries(state, data) {
    state.entries = data
  },
  setEntryNum(state, data) {
    state.entryNum = data
  },
  setSelectedEntries(state, data) {
    state.selectedEntries = data
  }
}

export const actions = {
  updateHeaders({ commit }, data) {
    commit("setHeaders", data)
  },
  async updateEntries({ commit, rootState }, optionContext) {
    const entries = await fetchEntries(
      this.$axios,
      rootState.filter,
      optionContext
    )
    commit("setEntries", entries)
  },
  async updateEntryNum({ commit, rootState }) {
    const entryNum = await fetchEntriesNum(this.$axios, rootState.filter)
    commit("setEntryNum", entryNum)
  },
  updateSelectedEntries({ commit }, data) {
    commit("setSelectedEntries", data)
  }
}
