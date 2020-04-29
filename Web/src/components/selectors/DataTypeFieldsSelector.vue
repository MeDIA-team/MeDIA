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
    viewType: {
      type: String,
      default: "",
      require: true
    },
    color: {
      type: String,
      default: "",
      require: true
    }
  },
  computed: {
    selectedDataTypeFields: {
      get() {
        return this.$store.state[`${this.viewType}Selector`].dataTypeFields.map(
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
          `${this.viewType}Selector/updateDataTypeFields`,
          value.map((val) => val.id)
        )
      }
    },
    treeviewItems() {
      return this.$store.getters[`${this.viewType}Selector/treeviewItems`]
    },
    openedTreeviewItems: {
      get() {
        return this.$store.state[`${this.viewType}Selector`].openedTreeviewItems
      },
      set(value) {
        this.$store.commit(
          `${this.viewType}Selector/setOpenedTreeviewItems`,
          value
        )
      }
    }
  }
}
</script>
