<template>
  <v-app>
    <header-bar view-type="patient" />
    <v-main class="background">
      <v-container fluid>
        <tool-card class="mb-6" view-type="patient" />
        <data-table class="mb-6" view-type="patient" />
      </v-container>
    </v-main>
    <footer-bar view-type="patient" />
  </v-app>
</template>

<script lang="ts">
import DataTable from '@/components/DataTable.vue'
import FooterBar from '@/components/FooterBar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import ToolCard from '@/components/ToolCard.vue'
import Vue from 'vue'

export default Vue.extend({
  components: {
    DataTable,
    FooterBar,
    HeaderBar,
    ToolCard,
  },

  async middleware({ store, $axios }) {
    const initActionQueue = ['filter/initialize', 'selector/initialize']
    for (const initAction of initActionQueue) {
      await store.dispatch(initAction, { viewType: 'patient', axios: $axios })
    }
  },
})
</script>

<style scoped>
#app {
  background: #f5f5f5;
}
</style>
