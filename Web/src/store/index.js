import { getProjects, getSexes, getDataTypes } from "~/util/data-fetcher"

export const state = () => ({
  projects: getProjects(),
  selectedProjects: [],
  inputtedPatientID: null,
  sexes: getSexes(),
  selectedSexes: [],
  inputtedBottomAge: null,
  inputtedUpperAge: null,
  inputtedBottomSamplingDate: null,
  inputtedUpperSamplingDate: null,
  dataTypes: getDataTypes(),
  selectedDataTypes: []
})

export const mutations = {
  updateSelectedProjects(state, payload) {
    state.selectedProjects = payload
  },
  updateInputtedPatientID(state, payload) {
    state.inputtedPatientID = payload
  },
  updateSelectedSexes(state, payload) {
    state.selectedSexes = payload
  },
  updateInputtedBottomAge(state, payload) {
    state.inputtedBottomAge = payload
  },
  updateInputtedUpperAge(state, payload) {
    state.inputtedUpperAge = payload
  },
  updateInputtedBottomSamplingDate(state, payload) {
    state.inputtedBottomSamplingDate = payload
  },
  updateInputtedUpperSamplingDate(state, payload) {
    state.inputtedUpperSamplingDate = payload
  },
  updateSelectedDataTypes(state, payload) {
    state.selectedDataTypes = payload
  }
}

export const actions = {}
