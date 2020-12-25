<template>
  <v-btn
    class="ml-4"
    color="info"
    max-width="160"
    min-width="160"
    outlined
    @click="operateTreeview"
  >
    {{ buttonText }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { TypedStore } from '@/store'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

type Data = Record<string, never>

type Methods = {
  operateTreeview: () => void
}

type Computed = {
  buttonText: string
}

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

  computed: {
    buttonText() {
      return (this.$store as TypedStore).state.selector[
        this.viewType as 'sample' | 'patient'
      ].dataTypeFields.opened.length === 0
        ? 'Expand Tree'
        : 'Collapse Tree'
    },
  },

  methods: {
    operateTreeview() {
      if (
        (this.$store as TypedStore).state.selector[
          this.viewType as 'sample' | 'patient'
        ].dataTypeFields.opened.length === 0
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
}

export default Vue.extend(options)
</script>
