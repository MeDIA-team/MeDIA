<template>
  <div class="d-flex flex-column">
    <required-fields-selector></required-fields-selector>
    <div class="d-flex">
      <v-btn
        color="info"
        max-width="160"
        min-width="160"
        outlined
        @click="setInitialState"
        >Set Initial State</v-btn
      >
      <v-btn
        class="ml-4"
        color="info"
        max-width="160"
        min-width="160"
        outlined
        @click="operateTree"
        >{{ operateTreeButtonText }}</v-btn
      >
    </div>
    <data-type-fields-selector class="mt-2"></data-type-fields-selector>
  </div>
</template>

<script>
import RequiredFieldsSelector from "~/components/selectors/RequiredFieldsSelector.vue"
import DataTypeFieldsSelector from "~/components/selectors/DataTypeFieldsSelector.vue"

export default {
  components: {
    RequiredFieldsSelector,
    DataTypeFieldsSelector
  },
  computed: {
    operateTreeButtonText() {
      return this.$store.state.selector.treeviewOpen.length === 0
        ? "Expand Tree"
        : "Contract Tree"
    }
  },
  methods: {
    setInitialState() {
      this.$store.dispatch("selector/initialize")
    },
    operateTree() {
      if (this.$store.state.selector.treeviewOpen.length !== 0) {
        this.$store.dispatch("selector/updateTreeviewOpen", [])
      } else {
        this.$store.dispatch(
          "selector/updateTreeviewOpen",
          this.$store.getters["selector/treeviewItems"]
        )
      }
    }
  }
}
</script>
