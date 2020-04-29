export const state = () => ({
  options: {
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    groupDesc: [],
    mustSort: false,
    multiSort: true
  },
  loading: true,
  shownEntries: [],
  processedSampleIDs: [],
  selectedSampleIDs: [],
  entryCount: 0,
  patientCount: 0,
  sampleIDAndDataTypeTable: {},
  sampleIDAndPatientIDTable: {}
})

export const mutations = {
  setOptions(state, data) {
    state.options = data
  },
  setPageFirst(state) {
    state.options.page = 1
  },
  setLoading(state, data) {
    state.loading = data
  },
  setShownEntries(state, data) {
    state.shownEntries = data
  },
  setProcessedSampleIDs(state, data) {
    state.processedSampleIDs = data
  },
  setSelectedSampleIDs(state, data) {
    state.selectedSampleIDs = data
  },
  setEntryCount(state, data) {
    state.entryCount = data
  },
  setPatientCount(state, data) {
    state.patientCount = data
  },
  setSampleIDAndDataTypeTable(state, data) {
    state.sampleIDAndDataTypeTable = data
  },
  setSampleIDAndPatientIDTable(state, data) {
    state.sampleIDAndPatientIDTable = data
  }
}

export const getters = {
  getSelectedEntries(state) {
    return state.selectedSampleIDs.map((sampleID) => {
      return { sampleID }
    })
  },
  headers(state, getters, rootState, rootGetters) {
    const headers = rootState.selector.requiredFields
      .filter((key) => key !== "dataType")
      .map((key) => {
        const field = rootState.const.requiredFields.find(
          (item) => item.key === key
        )
        return {
          text: field.label,
          align: "start",
          sortable: true,
          value: field.key,
          width: field.width
        }
      })
    for (const field of rootState.selector.dataTypeFields) {
      headers.push({
        text: field.includes("_") ? field.replace("_", ": ") : field,
        align: field.includes("_") ? "start" : "center",
        sortable: field.includes("_"),
        value: field
      })
    }
    return headers
  }
}

export const actions = {
  async initialize({ state, commit }) {
    const queue = [
      {
        func: this.$dataFetcher.fetchSampleIDTable,
        arg: "dataType",
        mutation: "setSampleIDAndDataTypeTable"
      },
      {
        func: this.$dataFetcher.fetchSampleIDTable,
        arg: "patientID",
        mutation: "setSampleIDAndPatientIDTable"
      }
    ]
    const promiseQueue = queue.map((item) => item.func(item.arg))
    const results = await Promise.all(promiseQueue).catch((err) => {
      throw err
    })
    for (let i = 0; i < queue.length; i++) {
      commit(queue[i].mutation, results[i])
    }
  },

  async updateEntries({ commit, state, rootState }) {
    commit("setLoading", true)
    const filteredAndSortedSampleIDs = await this.$dataFetcher
      .fetchFilteredAndSortedSampleIDs(state.options, rootState.filter)
      .catch((err) => {
        throw err
      })
    let processedSampleIDs
    if (rootState.filter.dataTypes.length !== 0) {
      processedSampleIDs = filteredAndSortedSampleIDs.filter((sampleID) => {
        const dataTypeSet = state.sampleIDAndDataTypeTable[sampleID]
        return rootState.filter.dataTypes.every((dataType) =>
          dataTypeSet.has(dataType)
        )
      })
    } else {
      processedSampleIDs = filteredAndSortedSampleIDs
    }
    commit("setProcessedSampleIDs", processedSampleIDs)
    commit("setSelectedSampleIDs", processedSampleIDs)
    commit("setEntryCount", processedSampleIDs.length)
    const patientIDSet = new Set()
    processedSampleIDs.forEach((sampleID) => {
      state.sampleIDAndPatientIDTable[sampleID].forEach((patientID) => {
        patientIDSet.add(patientID)
      })
    })
    commit("setPatientCount", patientIDSet.size)
    const { page, itemsPerPage } = state.options
    const shownSampleIDs = processedSampleIDs.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    )
    const entryDocs = await this.$dataFetcher
      .fetchEntryDocs(shownSampleIDs)
      .catch((err) => {
        throw err
      })
    const shownEntries = shownSampleIDs.reduce(
      (arr, cur) => ({ ...arr, [cur]: {} }),
      {}
    )
    entryDocs.forEach((doc) => {
      const sampleID = doc.sampleID
      const dataType = doc.dataType
      Object.entries(doc).forEach(([key, val]) => {
        if (
          rootState.const.requiredFields
            .map((item) => item.key)
            .filter((key) => key !== "dataType")
            .includes(key)
        ) {
          shownEntries[sampleID][key] = val
        } else if (key === "dataType") {
          shownEntries[sampleID][dataType] = true
        } else {
          shownEntries[sampleID][dataType + "_" + key] = val
        }
      })
    })
    commit("setShownEntries", Object.values(shownEntries))
    commit("setLoading", false)
  },
  updateSelectedSampleIDs({ commit }, data) {
    commit(
      "setSelectedSampleIDs",
      data.map((item) => item.sampleID)
    )
  }
}
