export const state = () => ({
  requiredFields: [],
  dataTypeFields: [],
  openedTreeviewItems: []
})

export const getters = {
  headers(state, getters, rootState) {
    const headers = state.requiredFields
      .filter((key) => key !== "dataType")
      .map((key) => {
        const field = rootState.const.requiredFields.find(
          (item) => item.key === key
        )
        return {
          text: field.label,
          align: "start",
          sortable: true,
          value: field.key,
          width: field.width
        }
      })
    for (const field of state.dataTypeFields) {
      headers.push({
        text: field.includes("_") ? field.replace("_", ": ") : field,
        align: field.includes("_") ? "start" : "center",
        sortable: field.includes("_"),
        value: field
      })
    }
    return headers
  },
  treeviewItems(state, getters, rootState) {
    return rootState.init.dataTypes.map((dataType) => {
      return {
        id: dataType,
        name: dataType,
        children: rootState.init.dataTypeFields[dataType].map((field) => {
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
    state.requiredFields = payload
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
    commit("setDataTypeFields", rootState.init.dataTypes)
  },
  updateRequiredFields({ commit, rootState }, payload) {
    const sortedData = rootState.const.requiredFields
      .filter((field) => payload.includes(field.key))
      .map((field) => field.key)
    commit("setRequiredFields", sortedData)
  },
  updateDataTypeFields({ commit, rootState }, payload) {
    const sortedData = []
    for (const dataType of rootState.init.dataTypes) {
      if (payload.includes(dataType)) {
        sortedData.push(dataType)
      }
      for (const field of rootState.init.dataTypeFields[dataType]) {
        if (payload.includes(`${dataType}_${field}`)) {
          sortedData.push(`${dataType}_${field}`)
        }
      }
    }
    commit("setDataTypeFields", sortedData)
  }
}
