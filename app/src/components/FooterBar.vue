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
import Vue from 'vue'

interface Computed {
  viewType: string
  color: string
}

export default Vue.extend({
  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
  },
})
</script>
