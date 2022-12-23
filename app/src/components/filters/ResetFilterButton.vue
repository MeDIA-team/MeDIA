<template>
  <v-btn
    color="info"
    max-width="160"
    min-width="160"
    outlined
    @click="reset"
    v-text="'Reset Filter'"
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
      this.$store.commit('filter/reset', { viewType: this.viewType })
    },
  },
})
</script>
