<template>
  <v-btn
    color="info"
    max-width="160"
    min-width="160"
    outlined
    @click="resetSelector"
  >
    Reset Selector
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

type Data = Record<string, never>

type Methods = {
  resetSelector: () => void
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
    resetSelector() {
      this.$store.commit('selector/resetSelector', { viewType: this.viewType })
    },
  },
}

export default Vue.extend(options)
</script>
