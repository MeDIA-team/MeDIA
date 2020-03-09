export const state = () => ({
  selectedProjects: [],
  inputtedPatientID: null,
  selectedSexes: [],
  inputtedBottomAge: null,
  inputtedUpperAge: null,
  inputtedSampleID: null,
  inputtedBottomSamplingDate: null,
  inputtedUpperSamplingDate: null,
  selectedDataTypes: []
})

export const getters = {}

export const mutations = {
  setSelectedProjects(state, data) {
    state.selectedProjects = data
  },
  setInputtedPatientID(state, data) {
    state.inputtedPatientID = data
  },
  setSelectedSexes(state, data) {
    state.selectedSexes = data
  },
  setInputtedBottomAge(state, data) {
    state.inputtedBottomAge = data
  },
  setInputtedUpperAge(state, data) {
    state.inputtedUpperAge = data
  },
  setInputtedSampleID(state, data) {
    state.inputtedSampleID = data
  },
  setInputtedBottomSamplingDate(state, data) {
    state.inputtedBottomSamplingDate = data
  },
  setInputtedUpperSamplingDate(state, data) {
    state.inputtedUpperSamplingDate = data
  },
  setSelectedDataTypes(state, data) {
    state.selectedDataTypes = data
  }
}

export const actions = {
  async nuxtServerInit() {},
  updateSelectedProjects({ commit }, data) {
    commit("setSelectedProjects", data)
  },
  updateInputtedPatientID({ commit }, data) {
    commit("setInputtedPatientID", data)
  },
  updateSelectedSexes({ commit }, data) {
    commit("setSelectedSexes", data)
  },
  updateInputtedBottomAge({ commit }, data) {
    commit("setInputtedBottomAge", data)
  },
  updateInputtedUpperAge({ commit }, data) {
    commit("setInputtedUpperAge", data)
  },
  updateInputtedSampleID({ commit }, data) {
    commit("setInputtedSampleID", data)
  },
  updateInputtedBottomSamplingDate({ commit }, data) {
    commit("setInputtedBottomSamplingDate", data)
  },
  updateInputtedUpperSamplingDate({ commit }, data) {
    commit("setInputtedUpperSamplingDate", data)
  },
  updateSelectedDataTypes({ commit }, data) {
    commit("setSelectedDataTypes", data)
  }
}
