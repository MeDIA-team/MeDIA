<template>
  <div>
    <div>Test Components</div>
    <v-btn>Hoge</v-btn>
    <div>{{ fixedData }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { State as TestState } from '@/store/test'

type Data = {
  test: string
}

type Methods = {}

type Computed = {
  fixedData: string
}

type Props = {}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  data() {
    return {
      test: 'test_text' as string,
    }
  },

  computed: {
    fixedData() {
      return (this.$store.state.test as TestState).test
      // return this.test
    },
  },
}

export default Vue.extend(options)
</script>
