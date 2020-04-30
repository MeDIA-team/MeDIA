<template>
  <div>
    <span class="info--text title">
      Data Type
    </span>
    <v-treeview
      v-model="selectedDataTypeFields"
      :color="color"
      :items="treeviewItems"
      :open.sync="openedTreeviewItems"
      :selected-color="color"
      class="info--text"
      dense
      hoverable
      return-object
      rounded
      selectable
      selection-type="independent"
    ></v-treeview>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "",
      require: true
    }
  },
  computed: {
    selectedDataTypeFields: {
      get() {
        return this.$store.state.selector.dataTypeFields.map((val) => {
          return {
            id: val,
            name: val
          }
        })
      },
      set(value) {
        this.$store.dispatch(
          "selector/updateDataTypeFields",
          value.map((val) => val.id)
        )
      }
    },
    treeviewItems() {
      return this.$store.getters["selector/treeviewItems"]
    },
    openedTreeviewItems: {
      get() {
        return this.$store.state.selector.openedTreeviewItems
      },
      set(value) {
        this.$store.commit("selector/setOpenedTreeviewItems", value)
      }
    }
  }
}
</script>
