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
  patientCount: 0
})

export const mutations = {
  setOptions(state, data) {
    state.options = data
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
    state.PatientCount = data
  }
}

export const getters = {
  getSelectedEntries(state) {
    return state.selectedSampleIDs.map((sampleID) => {
      return { sampleID }
    })
  },
  headers(state, getters, rootState, rootGetters) {
    const headers = rootState.selector.selectedRequiredFields
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
    for (const field of rootState.selector.selectedDataTypeFields) {
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
  async updateEntries({ commit, state, rootState }) {
    console.log("FFFFFFFFFFFFFFFF")
    commit("setLoading", true)
    const filteredAndSortedSampleIDs = await this.$dataFetcher
      .fetchFilteredAndSortedSampleIDs(state.options, rootState.filter)
      .catch((err) => {
        throw err
      })
    let processedSampleIDs
    if (rootState.filter.inputtedDataTypes.length !== 0) {
      processedSampleIDs = filteredAndSortedSampleIDs.filter((sampleID) => {
        const dataTypeSet = rootState.init.sampleIDAndDataTypeTable[sampleID]
        return rootState.filter.inputtedDataTypes.every((dataType) =>
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
      rootState.init.sampleIDAndPatientIDTable[sampleID].forEach(
        (patientID) => {
          patientIDSet.add(patientID)
        }
      )
    })
    commit("setPatientCount", patientIDSet.length)
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
  updateOptions({ commit }, data) {
    commit("setOptions", data)
  },
  updateSelectedSampleIDs({ commit }, data) {
    commit(
      "setSelectedSampleIDs",
      data.map((item) => item.sampleID)
    )
  }
}
