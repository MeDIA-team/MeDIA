<template>
  <v-btn
    color="info"
    max-width="160"
    min-width="160"
    outlined
    @click="reset"
    v-text="'Reset Selector'"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },
  },

  methods: {
    reset() {
      this.$store.commit('selector/reset', { viewType: this.viewType })
    },
  },
})
</script>
