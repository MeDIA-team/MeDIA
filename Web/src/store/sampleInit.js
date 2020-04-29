export const state = () => ({
  projects: [],
  sexes: [],
  diseases: [],
  dataTypes: [],
  patientIDs: [],
  projectPatientIDs: [],
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
  setProjectPatinetIDs(state, data) {
    state.projectPatientIDs = data
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
  async initialize({ state, commit }) {
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
        arg: "projectPatientID",
        mutation: "setProjectPatinetIDs"
      },
      {
        func: this.$dataFetcher.fetchUniqueValues,
        arg: "sampleID",
        mutation: "setSampleIDs"
      },
      {
        func: this.$dataFetcher.fetchDataTypeFields,
        mutation: "setDataTypeFields"
      },
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

    commit("setTotalSampleIDCount", state.sampleIDs.length)
    commit("setTotalPatientIDCount", state.patientIDs.length)
  }
}
