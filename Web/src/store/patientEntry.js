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
  processedPatientIDs: [],
  selectedPatientIDs: [],
  sampleCount: 0,
  patientCount: 0,
  patientIDAndDataTypeTable: {},
  patientIDAndSampleIDTable: {}
})

export const mutations = {
  setOptions(state, payload) {
    state.options = payload
  },
  setPageFirst(state) {
    state.options.page = 1
  },
  setLoading(state, payload) {
    state.loading = payload
  },
  setShownEntries(state, payload) {
    state.shownEntries = payload
  },
  setProcessedPatientIDs(state, payload) {
    state.processedPatientIDs = payload
  },
  setSelectedPatientIDs(state, payload) {
    state.selectedPatientIDs = payload
  },
  setSampleCount(state, payload) {
    state.sampleCount = payload
  },
  setPatientCount(state, payload) {
    state.patientCount = payload
  },
  setPatientIDAndDataTypeTable(state, payload) {
    state.patientIDAndDataTypeTable = payload
  },
  setPatientIDAndSampleIDTable(state, payload) {
    state.patientIDAndSampleIDTable = payload
  }
}

export const getters = {
  getSelectedEntries(state) {
    return state.selectedPatientIDs.map((patientID) => {
      return { patientID }
    })
  }
}

export const actions = {
  async initialize({ commit }) {
    const queue = [
      {
        func: this.$dataFetcher.fetchTable,
        fromField: "patientID",
        toField: "dataType",
        mutation: "setPatientIDAndDataTypeTable"
      },
      {
        func: this.$dataFetcher.fetchTable,
        fromField: "patientID",
        toField: "sampleID",
        mutation: "setPatientIDAndSampleIDTable"
      }
    ]
    const promiseQueue = queue.map((item) =>
      item.func(item.fromField, item.toField)
    )
    const results = await Promise.all(promiseQueue).catch((err) => {
      throw err
    })
    for (let i = 0; i < queue.length; i++) {
      commit(queue[i].mutation, results[i])
    }
  },

  async updateEntries({ commit, state, rootState }) {
    commit("setLoading", true)
    const filteredAndSortedPatientIDs = await this.$dataFetcher
      .fetchFilteredAndSortedIDs("patientID", state.options, rootState.filter)
      .catch((err) => {
        throw err
      })
    let processedPatientIDs
    if (rootState.filter.dataTypes.length !== 0) {
      processedPatientIDs = filteredAndSortedPatientIDs.filter((patientID) => {
        const dataTypeSet = state.patientIDAndDataTypeTable[patientID]
        return rootState.filter.dataTypes.every((dataType) =>
          dataTypeSet.has(dataType)
        )
      })
    } else {
      processedPatientIDs = filteredAndSortedPatientIDs
    }
    commit("setProcessedPatientIDs", processedPatientIDs)
    commit("setSelectedPatientIDs", processedPatientIDs)
    commit("setPatientCount", processedPatientIDs.length)

    const sampleIDSet = new Set()
    processedPatientIDs.forEach((patientID) => {
      state.patientIDAndSampleIDTable[patientID].forEach((sampleID) => {
        sampleIDSet.add(sampleID)
      })
    })
    commit("setSampleCount", sampleIDSet.size)

    const { page, itemsPerPage } = state.options
    const shownPatientIDs = processedPatientIDs.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    )
    const shownEntries = shownPatientIDs.reduce(
      (arr, cur) => ({ ...arr, [cur]: {} }),
      {}
    )
    const showSampleIDSet = new Set()
    shownPatientIDs.forEach((patientID) => {
      state.patientIDAndSampleIDTable[patientID].forEach((sampleID) => {
        showSampleIDSet.add(sampleID)
      })
    })
    const shownSampleIDs = Array.from(showSampleIDSet)
    for (
      let i = 0;
      i < shownSampleIDs.length;
      i += rootState.const.dumpChunkSize
    ) {
      const sampleIDChunk = shownSampleIDs.slice(
        i,
        i + rootState.const.dumpChunkSize
      )
      const entryDocs = await this.$dataFetcher
        .fetchEntryDocs("sampleID", sampleIDChunk)
        .catch((err) => {
          throw err
        })
      entryDocs.forEach((doc) => {
        const patientID = doc.patientID
        const dataType = doc.dataType
        Object.entries(doc).forEach(([key, val]) => {
          if (
            rootState.const.requiredFields
              .map((item) => item.key)
              .filter((key) => key !== "dataType")
              .includes(key)
          ) {
            if (!(key in shownEntries[patientID])) {
              shownEntries[patientID][key] = new Set()
            }
            shownEntries[patientID][key].add(val)
          } else if (key === "dataType") {
            shownEntries[patientID][dataType] = true
          } else {
            const dataTypeKey = dataType + "_" + key
            if (!(dataTypeKey in shownEntries[patientID])) {
              shownEntries[patientID][dataTypeKey] = new Set()
            }
            shownEntries[patientID][dataTypeKey].add(val)
          }
        })
      })
    }

    for (const patientID of Object.keys(shownEntries)) {
      const entry = shownEntries[patientID]
      for (const key of Object.keys(entry)) {
        const value = entry[key]
        if (typeof value === "object") {
          const joinedValue = Array.from(value).join(", ")
          shownEntries[patientID][key] = joinedValue
        }
      }
    }
    commit("setShownEntries", Object.values(shownEntries))
    commit("setLoading", false)
  },
  updateSelectedIDs({ commit }, payload) {
    commit(
      "setSelectedPatientIDs",
      payload.map((item) => item.patientID)
    )
  }
}
