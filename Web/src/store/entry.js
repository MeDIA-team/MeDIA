import { fetchEntries } from "~/util/data-fetcher"

export const state = () => ({
  headers: [],
  entries: [],
  entryNum: null,
  selectedEntries: [],
  loading: true
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
  },
  setLoading(state, bool) {
    state.loading = bool
  }
}

export const actions = {
  updateHeaders({ commit }, data) {
    commit("setHeaders", data)
  },
  async updateEntries({ commit, rootState }) {
    const entries = await fetchEntries(this.$axios, rootState.filter)
    commit("setEntries", entries)
  },
  updateEntryNum({ commit }, data) {
    commit("setEntryNum", data)
  },
  updateSelectedEntries({ commit }, data) {
    commit("setSelectedEntries", data)
  },
  updateLoading({ commit }, bool) {
    commit("setLoading", bool)
  }
}
