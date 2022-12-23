<template>
  <v-btn
    class="ml-4"
    color="info"
    max-width="160"
    min-width="160"
    outlined
    @click="operateTreeview"
    v-text="buttonText"
  />
</template>

<script lang="ts">
import Vue from 'vue'

interface Methods {
  operateTreeview: () => void
}

interface Computed {
  viewType: string
  buttonText: string
}

export default Vue.extend({
  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    buttonText() {
      return this.$store.state.selector[this.viewType].dataTypeFields.opened
        .length === 0
        ? 'Expand Tree'
        : 'Collapse Tree'
    },
  },

  methods: {
    operateTreeview() {
      if (
        this.$store.state.selector[this.viewType].dataTypeFields.opened
          .length === 0
      ) {
        this.$store.commit('selector/expandTreeview', {
          viewType: this.viewType,
        })
      } else {
        this.$store.commit('selector/collapseTreeview', {
          viewType: this.viewType,
        })
      }
    },
  },
})
</script>
