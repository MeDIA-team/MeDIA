<template>
  <div>
    <span class="grey--text text--darken-4 title">
      Data Type
    </span>
    <v-treeview
      v-model="selectedDataTypesColumns"
      :items="dataTypesColumns"
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
    const dataTypesColumns = this.$store.state.init.dataTypes.map(
      (dataType) => {
        return {
          id: dataType,
          name: dataType,
          children: this.$store.state.init.dataTypesMetadataFields[
            dataType
          ].map((value) => {
            return {
              id: dataType + "_" + value,
              name: value
            }
          })
        }
      }
    )

    return {
      dataTypesColumns
    }
  },
  computed: {
    selectedDataTypesColumns: {
      get() {
        return this.$store.state.selector.selectedDataTypesColumns.map(
          (val) => {
            return {
              id: val,
              name: val
            }
          }
        )
      },
      set(value) {
        this.$store.dispatch(
          "selector/updateSelectedDataTypesColumns",
          value.map((val) => val.id)
        )
      }
    }
  }
}
</script>
