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
    // initinalize subscriptions
    store.state.unsubscribe.patient && store.state.unsubscribe.patient()
    store.state.unsubscribe.sample && store.state.unsubscribe.sample()

    // initialize store
    await store.dispatch('filter/initialize', {
      viewType: 'patient',
      dataConfig: $dataConfig,
      axios: $axios,
    })
    await store.dispatch('selector/initialize', {
      viewType: 'patient',
      dataConfig: $dataConfig,
      axios: $axios,
    })
    await store.dispatch('filter/setSelectedIds', {
      viewType: 'patient',
    })

    // set subscriptions
    const subscribeMutations = [
      'filter/setValue',
      'filter/reset',
      'entry/setOptions',
    ]
    const unsubscribeFunc = store.subscribe(async (mutation) => {
      if (subscribeMutations.includes(mutation.type)) {
        await store.dispatch('entry/updateEntries', {
          viewType: 'patient',
          axios: $axios,
          dataConfig: $dataConfig,
        })
        await store.dispatch('entry/updateEntryCount', {
          viewType: 'patient',
          axios: $axios,
          dataConfig: $dataConfig,
        })
      }
    })
    store.commit('unsubscribe/setValue', {
      viewType: 'patient',
      value: unsubscribeFunc,
    })
  },
})
</script>

<style scoped>
#app {
  background: #f5f5f5;
}
</style>
