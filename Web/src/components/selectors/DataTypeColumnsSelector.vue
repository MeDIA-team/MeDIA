<template>
  <div>
    <span class="grey--text text--darken-4 title">
      Data Type
    </span>
    <v-treeview
      v-model="selectedDataTypeColumns"
      :items="dataTypeColumns"
      dense
      hoverable
      return-object
      rounded
      selectable
      selected-color="primary"
      selection-type="independent"
    ></v-treeview>
  </div>
</template>

<script>
export default {
  data() {
    const dataTypeColumns = this.$store.state.dataTypes.map((dataType) => {
      return {
        id: dataType,
        name: dataType,
        children: this.$store.state.dataTypesMetaDataKeys[dataType].map(
          (value) => {
            return {
              id: dataType + "_" + value,
              name: value
            }
          }
        )
      }
    })

    return {
      dataTypeColumns
    }
  },
  computed: {
    selectedDataTypeColumns: {
      get() {
        return this.$store.state.selectedDataTypesColumnIDs.map((val) => {
          return {
            id: val,
            name: val
          }
        })
      },
      set(value) {
        this.$store.commit(
          "updateSelectedDataTypesColumnIDs",
          value.map((val) => val.id)
        )
      }
    }
  }
}
</script>
