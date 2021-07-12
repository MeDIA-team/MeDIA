<template>
  <v-footer app :color="color" padless absolute height="30px">
    <div
      class="d-flex align-center justify-center"
      :style="{ width: '100%', height: '100%' }"
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

interface Computed {
  viewType: string
  color: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Record<string, never>,
  Record<string, never>,
  Computed,
  Record<string, never>
> = {
  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
  },
}

export default Vue.extend(options)
</script>
