<template>
  <v-app-bar absolute app :color="color">
    <nuxt-link to="/">
      <v-toolbar-title class="headline white--text" v-text="headerText" />
    </nuxt-link>
    <v-spacer />
    <v-btn color="white" nuxt outlined raise :to="anotherViewTo">
      <v-icon>{{ anotherViewButtonIcon }}</v-icon>
      <div class="ml-2" v-text="anotherViewButtonText" />
    </v-btn>
    <export-selected-entries-button class="ml-4" />
    <export-all-entries-button class="ml-4" />
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import ExportAllEntriesButton from '@/components/ExportAllEntriesButton.vue'
import ExportSelectedEntriesButton from '@/components/ExportSelectedEntriesButton.vue'

export default Vue.extend({
  components: {
    ExportAllEntriesButton,
    ExportSelectedEntriesButton,
  },

  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },

    headerText() {
      return this.viewType === 'sample' ? 'MeDIA Sample' : 'MeDIA Patient'
    },

    anotherViewTo() {
      return this.viewType === 'sample' ? '/patient' : '/sample'
    },

    anotherViewButtonIcon() {
      return this.viewType === 'sample'
        ? 'mdi-account-outline'
        : 'mdi-flask-outline'
    },

    anotherViewButtonText() {
      return this.viewType === 'sample' ? 'To Patient View' : 'To Sample View'
    },
  },
})
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
