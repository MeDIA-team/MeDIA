import {
  getProjects,
  getSexes,
  getDataTypes,
  getDataTypesMetaDataKeys
} from "~/util/data-fetcher"
import { defaultColumns } from "~/components/selectors/DefaultColumnsSelector"

export const state = () => ({
  projects: getProjects(),
  selectedProjects: [],
  inputtedPatientID: null,
  sexes: getSexes(),
  selectedSexes: [],
  inputtedBottomAge: null,
  inputtedUpperAge: null,
  inputtedSampleID: null,
  inputtedBottomSamplingDate: null,
  inputtedUpperSamplingDate: null,
  dataTypes: getDataTypes(),
  selectedDataTypes: [],
  dataTypesMetaDataKeys: getDataTypesMetaDataKeys(),
  selectedDefaultColumns: defaultColumns,
  selectedDataTypesColumnIDs: getDataTypes()
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
  updateInputtedSampleID(state, payload) {
    state.inputtedSampleID = payload
  },
  updateInputtedBottomSamplingDate(state, payload) {
    state.inputtedBottomSamplingDate = payload
  },
  updateInputtedUpperSamplingDate(state, payload) {
    state.inputtedUpperSamplingDate = payload
  },
  updateSelectedDataTypes(state, payload) {
    state.selectedDataTypes = payload
  },
  updateSelectedDefaultColumns(state, payload) {
    state.selectedDefaultColumns = payload
  },
  updateSelectedDataTypesColumnIDs(state, payload) {
    state.selectedDataTypesColumnIDs = payload
  }
}

export const actions = {}
