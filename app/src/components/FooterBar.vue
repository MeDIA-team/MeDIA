<template>
  <v-footer app :color="color" padless absolute height="30px">
    <div
      class="d-flex align-center justify-center"
      style="width: 100%; height: 100%"
    >
      <!-- <div>
        <span class="block text-center caption white--text" />
      </div> -->
    </div>
  </v-footer>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'

type Data = Record<string, never>

type Methods = Record<string, never>

type Computed = {
  color: string
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
    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
  },
}

export default Vue.extend(options)
</script>
