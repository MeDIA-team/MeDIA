import {
  fetchAggregatedValues,
  fetchFields,
  fetchDataTypesMetadataFields
} from "~/util/data-fetcher"

export const state = () => ({
  projects: [],
  sexes: [],
  dataTypes: [],
  dataTypesMetadataFields: {},
  defaultFields: [
    "projectName",
    "projectID",
    "patientID",
    "sex",
    "age",
    "sampleID",
    "samplingDate",
    "dataType"
  ]
})

export const getters = {}

export const mutations = {
  setProjects(state, data) {
    state.projects = data
  },
  setSexes(state, data) {
    state.sexes = data
  },
  setDataTypes(state, data) {
    state.dataTypes = data
  },
  setDataTypesMetadataFields(state, data) {
    state.dataTypesMetadataFields = data
  }
}

export const actions = {
  async initProjects({ commit }) {
    const projects = await fetchAggregatedValues(this.$axios, "projectName")
    commit("setProjects", projects)
  },
  async initSexes({ commit }) {
    const sexes = await fetchAggregatedValues(this.$axios, "sex")
    commit("setSexes", sexes)
  },
  async initDataTypes({ commit }) {
    const dataTypes = await fetchAggregatedValues(this.$axios, "dataType")
    commit("setDataTypes", dataTypes)
  },
  async initDataTypesMetadataFields({ state, commit }) {
    const dataTypes = await fetchAggregatedValues(this.$axios, "dataType")
    const fields = await fetchFields(this.$axios)
    const metadataFields = fields.filter(
      (field) => !state.defaultFields.includes(field)
    )
    const dataTypesMetadataFields = await fetchDataTypesMetadataFields(
      this.$axios,
      dataTypes,
      metadataFields
    )
    commit("setDataTypesMetadataFields", dataTypesMetadataFields)
  }
}
