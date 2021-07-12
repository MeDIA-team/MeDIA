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
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

interface Methods {
  reset: () => void
}

interface Computed {
  viewType: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Record<string, never>,
  Methods,
  Computed,
  Record<string, never>
> = {
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
}

export default Vue.extend(options)
</script>
