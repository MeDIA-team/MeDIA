export const state = () => ({
  requireFields: [],
  dataTypeFields: [],
  openedTreeviewItems: []
})

export const getters = {
  treeviewItems(state, getters, rootState, rootGetters) {
    return rootState.sampleInit.dataTypes.map((dataType) => {
      return {
        id: dataType,
        name: dataType,
        children: rootState.sampleInit.dataTypeFields[dataType].map((field) => {
          return {
            id: dataType + "_" + field,
            name: field
          }
        })
      }
    })
  }
}

export const mutations = {
  setRequiredFields(state, payload) {
    state.requireFields = payload
  },
  setDataTypeFields(state, payload) {
    state.dataTypeFields = payload
  },
  setOpenedTreeviewItems(state, payload) {
    state.openedTreeviewItems = payload
  }
}

export const actions = {
  initialize({ commit, rootState }) {
    commit(
      "setRequiredFields",
      rootState.const.requiredFields
        .map((item) => item.key)
        .filter((key) => key !== "dataType")
    )
    commit("setDataTypeFields", rootState.sampleInit.dataTypes)
  },
  updateRequiredFields({ commit, rootState }, payload) {
    const sortedData = rootState.const.requiredFields
      .filter((field) => payload.includes(field.key))
      .map((field) => field.key)
    commit("setRequiredFields", sortedData)
  },
  updateDataTypeFields({ commit, rootState }, payload) {
    const sortedData = []
    for (const dataType of rootState.sampleInit.dataTypes) {
      if (payload.includes(dataType)) {
        sortedData.push(dataType)
      }
      for (const field of rootState.sampleInit.dataTypeFields[dataType]) {
        if (payload.includes(`${dataType}_${field}`)) {
          sortedData.push(`${dataType}_${field}`)
        }
      }
    }
    commit("setDataTypeFields", sortedData)
  }
}
