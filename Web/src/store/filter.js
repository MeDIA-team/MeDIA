export const state = () => ({
  selectedProjects: [],
  inputtedPatientIDs: [],
  selectedSexes: [],
  inputtedBottomAge: "",
  inputtedUpperAge: "",
  selectedDiseases: [],
  inputtedSampleIDs: [],
  inputtedBottomSamplingDate: "",
  inputtedUpperSamplingDate: "",
  inputtedDataTypes: []
})

export const mutations = {
  setSelectedProjects(state, data) {
    state.selectedProjects = data
  },
  setInputtedPatientIDs(state, data) {
    state.inputtedPatientIDs = data
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
  setSelectedDiseases(state, data) {
    state.selectedDiseases = data
  },
  setInputtedSampleIDs(state, data) {
    state.inputtedSampleIDs = data
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
  initialize({ commit, rootState }) {
    commit("setSelectedProjects", rootState.init.projects)
    commit("setSelectedSexes", rootState.init.sexes)
    commit("setSelectedDiseases", rootState.init.diseases)
  },
  updateSelectedProjects({ commit }, data) {
    commit("setSelectedProjects", data)
  },
  updateInputtedPatientIDs({ commit }, data) {
    commit("setInputtedPatientIDs", data)
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
  updateSelectedDiseases({ commit }, data) {
    commit("setSelectedDiseases", data)
  },
  updateInputtedSampleIDs({ commit }, data) {
    commit("setInputtedSampleIDs", data)
  },
  updateInputtedBottomSamplingDate({ commit }, data) {
    commit("setInputtedBottomSamplingDate", data)
  },
  updateInputtedUpperSamplingDate({ commit }, data) {
    commit("setInputtedUpperSamplingDate", data)
  },
  updateInputtedDataTypes({ commit }, data) {
    commit("setInputtedDataTypes", data)
  }
}
