<template>
  <v-app>
    <header-bar view-type="sample" />
    <v-main class="background">
      <v-content>
        <v-container fluid>
          <!-- <tool-card class="mb-6" view-type="sample" /> -->
          <!-- <data-table class="mb-6" view-type="sample" /> -->
        </v-container>
      </v-content>
    </v-main>
    <footer-bar view-type="sample" />
  </v-app>
</template>

<script lang="ts">
// import DataTable from '@/components/DataTable.vue'
import FooterBar from '@/components/FooterBar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
// import ToolCard from '@/components/ToolCard.vue'
import Vue from 'vue'

export default Vue.extend({
  components: {
    // DataTable,
    FooterBar,
    HeaderBar,
    // ToolCard,
  },
})
</script>

<style scoped>
#app {
  background: #f5f5f5;
}
</style>
