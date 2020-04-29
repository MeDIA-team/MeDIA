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
  props: {
    viewType: {
      type: String,
      default: "",
      require: true
    }
  },
  computed: {
    buttonText() {
      return this.$store.state[`${this.viewType}Selector`].openedTreeviewItems
        .length === 0
        ? "Expand Tree"
        : "Contract Tree"
    }
  },
  methods: {
    operateTreeview() {
      if (
        this.$store.state[`${this.viewType}Selector`].openedTreeviewItems
          .length !== 0
      ) {
        this.$store.commit(
          `${this.viewType}Selector/setOpenedTreeviewItems`,
          []
        )
      } else {
        this.$store.commit(
          `${this.viewType}Selector/setOpenedTreeviewItems`,
          this.$store.getters[`${this.viewType}Selector/treeviewItems`]
        )
      }
    }
  }
}
</script>
