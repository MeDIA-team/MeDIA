export const state = () => ({
  projects: [],
  sexes: [],
  diseases: [],
  dataTypes: [],
  patientIDs: [],
  sampleIDs: [],
  dataTypeFields: {},
  totalPatientIDCount: 0,
  totalSampleIDCount: 0,
  sampleIDAndDataTypeTable: {},
  sampleIDAndPatientIDTable: {}
})

export const mutations = {
  setProjects(state, data) {
    state.projects = data
  },
  setSexes(state, data) {
    state.sexes = data
  },
  setDiseases(state, data) {
    state.diseases = data
  },
  setDataTypes(state, data) {
    state.dataTypes = data
  },
  setPatinetIDs(state, data) {
    state.patientIDs = data
  },
  setSampleIDs(state, data) {
    state.sampleIDs = data
  },
  setDataTypeFields(state, data) {
    state.dataTypeFields = data
  },
  setTotalSampleIDCount(state, data) {
    state.totalSampleIDCount = data
  },
  setTotalPatientIDCount(state, data) {
    state.totalPatientIDCount = data
  },
  setSampleIDAndDataTypeTable(state, data) {
    state.sampleIDAndDataTypeTable = data
  },
  setSampleIDAndPatientIDTable(state, data) {
    state.sampleIDAndPatientIDTable = data
  }
}

export const actions = {
  async initialize({ commit }) {
    const queue = [
      {
        func: this.$dataFetcher.fetchUniqueValues,
        arg: "projectName",
        mutation: "setProjects"
      },
      {
        func: this.$dataFetcher.fetchUniqueValues,
        arg: "sex",
        mutation: "setSexes"
      },
      {
        func: this.$dataFetcher.fetchUniqueValues,
        arg: "disease",
        mutation: "setDiseases"
      },
      {
        func: this.$dataFetcher.fetchUniqueValues,
        arg: "dataType",
        mutation: "setDataTypes"
      },
      {
        func: this.$dataFetcher.fetchUniqueValues,
        arg: "patientID",
        mutation: "setPatinetIDs"
      },
      {
        func: this.$dataFetcher.fetchUniqueValues,
        arg: "sampleID",
        mutation: "setSampleIDs"
      },
      {
        func: this.$dataFetcher.fetchTotalCount,
        arg: "sampleID",
        mutation: "setTotalSampleIDCount"
      },
      {
        func: this.$dataFetcher.fetchTotalCount,
        arg: "patientID",
        mutation: "setTotalPatientIDCount"
      },
      {
        func: this.$dataFetcher.fetchDataTypeFields,
        arg: undefined,
        mutation: "setDataTypeFields"
      }
    ]
    for (const item of queue) {
      const value = await item.func(item.arg).catch((err) => {
        throw err
      })
      commit(item.mutation, value)
    }
  }
}
