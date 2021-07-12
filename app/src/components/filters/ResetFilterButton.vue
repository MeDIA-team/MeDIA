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
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'

interface Methods {
  reset(): void
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
  methods: {
    reset() {
      this.$store.commit('filter/reset', { viewType: this.viewType })
    },
  },

  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },
  },
}

export default Vue.extend(options)
</script>
