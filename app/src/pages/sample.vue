<template>
  <v-app>
    <header-bar />
    <v-main class="background">
      <v-container fluid>
        <tool-card class="mb-6" />
        <data-table class="mb-6" />
      </v-container>
    </v-main>
    <footer-bar />
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

  async middleware({ store, $dataConfig, $axios }) {
    await store.dispatch('filter/initialize', {
      viewType: 'sample',
      dataConfig: $dataConfig,
      axios: $axios,
    })
    await store.dispatch('selector/initialize', {
      viewType: 'sample',
      dataConfig: $dataConfig,
      axios: $axios,
    })
    store.dispatch('filter/setSelectedIds', {
      viewType: 'sample',
    })
  },
})
</script>

<style scoped>
#app {
  background: #f5f5f5;
}
</style>
