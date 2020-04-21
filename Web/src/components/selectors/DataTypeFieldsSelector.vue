<template>
  <div>
    <span class="grey--text text--darken-3 title">
      Data Type
    </span>
    <v-treeview
      v-model="selectedDataTypeFields"
      :items="treeviewItems"
      :open.sync="treeviewOpen"
      class="grey--text text--darken-2"
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
    },
    treeviewItems() {
      return this.$store.getters["selector/treeviewItems"]
    },
    treeviewOpen: {
      get() {
        return this.$store.state.selector.treeviewOpen
      },
      set(value) {
        this.$store.dispatch("selector/updateTreeviewOpen", value)
      }
    }
  }
}
</script>
