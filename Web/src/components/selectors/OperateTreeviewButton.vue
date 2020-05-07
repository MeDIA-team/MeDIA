<template>
  <v-btn
    class="ml-4"
    color="info"
    max-width="160"
    min-width="160"
    outlined
    @click="operateTreeview"
    >{{ buttonText }}</v-btn
  >
</template>

<script>
export default {
  computed: {
    buttonText() {
      return this.$store.state.selector.openedTreeviewItems.length === 0
        ? "Expand Tree"
        : "Collapse Tree"
    }
  },
  methods: {
    operateTreeview() {
      if (this.$store.state.selector.openedTreeviewItems.length !== 0) {
        this.$store.commit("selector/setOpenedTreeviewItems", [])
      } else {
        this.$store.commit(
          "selector/setOpenedTreeviewItems",
          this.$store.getters["selector/treeviewItems"]
        )
      }
    }
  }
}
</script>
