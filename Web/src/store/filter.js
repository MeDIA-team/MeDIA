export const state = () => ({
  projects: [],
  patientIDs: [],
  projectPatientIDs: [],
  sexes: [],
  bottomAge: "",
  upperAge: "",
  diseases: [],
  sampleIDs: [],
  bottomSamplingDate: "",
  upperSamplingDate: "",
  dataTypes: []
})

export const mutations = {
  setProjects(state, payload) {
    state.projects = payload
  },
  setPatientIDs(state, payload) {
    state.patientIDs = payload
  },
  setProjectPatientIDs(state, payload) {
    state.projectPatientIDs = payload
  },
  setSexes(state, payload) {
    state.sexes = payload
  },
  setBottomAge(state, payload) {
    state.bottomAge = payload
  },
  setUpperAge(state, payload) {
    state.upperAge = payload
  },
  setDiseases(state, payload) {
    state.diseases = payload
  },
  setSampleIDs(state, payload) {
    state.sampleIDs = payload
  },
  setBottomSamplingDate(state, payload) {
    state.bottomSamplingDate = payload
  },
  setUpperSamplingDate(state, payload) {
    state.upperSamplingDate = payload
  },
  setDataTypes(state, payload) {
    state.dataTypes = payload
  },
  initialize(state, payload) {
    state.projects = payload.projects
    state.patientIDs = payload.patientIDs
    state.projectPatientIDs = payload.projectPatientIDs
    state.sexes = payload.sexes
    state.bottomAge = payload.bottomAge
    state.upperAge = payload.upperAge
    state.diseases = payload.diseases
    state.sampleIDs = payload.sampleIDs
    state.bottomSamplingDate = payload.bottomSamplingDate
    state.upperSamplingDate = payload.upperSamplingDate
    state.dataTypes = payload.dataTypes
  }
}

export const actions = {
  initialize({ commit, rootState }) {
    commit("initialize", {
      projects: rootState.init.projects,
      patientIDs: [],
      projectPatientIDs: [],
      sexes: rootState.init.sexes,
      bottomAge: "",
      upperAge: "",
      diseases: rootState.init.diseases,
      sampleIDs: [],
      bottomSamplingDate: "",
      upperSamplingDate: "",
      dataTypes: []
    })
  }
}
