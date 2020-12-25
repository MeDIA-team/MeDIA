<template>
  <v-btn
    color="info"
    max-width="160"
    min-width="160"
    outlined
    @click="resetFilter"
    v-text="'Reset Filter'"
  />
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'

type Data = Record<string, never>

type Methods = {
  resetFilter(): void
}

type Computed = Record<string, never>

type Props = {
  viewType: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  props: {
    viewType: {
      type: String,
      required: true,
      validator: (val: string) => {
        return ['sample', 'patient'].includes(val)
      },
    },
  },

  methods: {
    resetFilter() {
      this.$store.commit('filter/resetFilter', { viewType: this.viewType })
    },
  },
}

export default Vue.extend(options)
</script>
