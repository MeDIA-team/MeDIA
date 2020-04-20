<template>
  <div>
    <span class="grey--text text--darken-4 title">
      Data Type
    </span>
    <v-treeview
      v-model="selectedDataTypeFields"
      :items="dataTypeFields"
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
    const dataTypeFields = this.$store.state.init.dataTypes.map((dataType) => {
      return {
        id: dataType,
        name: dataType,
        children: this.$store.state.init.dataTypeFields[dataType].map(
          (field) => {
            return {
              id: dataType + "_" + field,
              name: field
            }
          }
        )
      }
    })

    return {
      dataTypeFields
    }
  },
  computed: {
    selectedDataTypeFields: {
      get() {
        return this.$store.state.selector.selectedDataTypeFields.map((val) => {
          return {
            id: val,
            name: val
          }
        })
      },
      set(value) {
        this.$store.dispatch(
          "selector/updateSelectedDataTypesFields",
          value.map((val) => val.id)
        )
      }
    }
  }
}
</script>
