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

export const getters = {
  getSelectedEntries(state) {
    return state.selectedEntries.map((entry) => {
      return { sampleID: entry }
    })
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
  async updateTotalSampleIDs({ commit, rootState }) {
    console.log(rootState.filter)
    const sampleIDs = await this.$dataFetcher.fetchEntriesSampleIDs(
      rootState.filter
    )
    commit("setEntryNum", sampleIDs.length)
    commit("setSelectedEntries", sampleIDs)
  },
  updateSelectedEntries({ commit }, data) {
    commit("setSelectedEntries", data)
  },
  updateSelectedEntriesFromTable({ commit }, data) {
    commit(
      "setSelectedEntries",
      data.map((item) => item.sampleID)
    )
  }
}
