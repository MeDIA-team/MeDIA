export const state = () => ({
  headers: [],
  entries: [],
  entryNum: null,
  selectedEntries: []
})

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
    const entries = await this.$dataFetcher.fetchEntries(
      rootState.filter,
      optionContext
    )
    commit("setEntries", entries)
  },
  async updateEntryNum({ commit, rootState }) {
    const entryNum = await this.$dataFetcher.fetchEntriesNum(rootState.filter)
    commit("setEntryNum", entryNum)
  },
  updateSelectedEntries({ commit }, data) {
    commit("setSelectedEntries", data)
  }
}
