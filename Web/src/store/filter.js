export const state = () => ({
  selectedProjects: [],
  inputtedPatientID: "",
  selectedSexes: [],
  inputtedBottomAge: "",
  inputtedUpperAge: "",
  inputtedSampleID: "",
  inputtedBottomSamplingDate: "",
  inputtedUpperSamplingDate: "",
  inputtedDataTypes: []
})

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
  setInputtedDataTypes(state, data) {
    state.inputtedDataTypes = data
  }
}

export const actions = {
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
  updateInputtedDataTypes({ commit }, data) {
    commit("setInputtedDataTypes", data)
  },
  initSelectedProjects({ commit, rootState }) {
    commit("setSelectedProjects", rootState.init.projects)
  },
  initSelectedSexes({ commit, rootState }) {
    commit("setSelectedSexes", rootState.init.sexes)
  }
}
