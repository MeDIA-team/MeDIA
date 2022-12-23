<template>
  <v-app-bar app :color="color" absolute>
    <nuxt-link to="/">
      <v-toolbar-title class="headline white--text" v-text="headerText" />
    </nuxt-link>
    <v-spacer />
    <v-btn :to="anotherViewTo" color="white" nuxt outlined raise>
      <v-icon>{{ anotherViewButtonIcon }}</v-icon>
      <div class="ml-2" v-text="anotherViewButtonText" />
    </v-btn>
    <export-selected-entries-button class="ml-4" />
    <export-all-entries-button class="ml-4" />
  </v-app-bar>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'
import ExportAllEntriesButton from '@/components/ExportAllEntriesButton.vue'
import ExportSelectedEntriesButton from '@/components/ExportSelectedEntriesButton.vue'

interface Computed {
  viewType: string
  color: string
  headerText: string
  anotherViewTo: string
  anotherViewButtonIcon: string
  anotherViewButtonText: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Record<string, never>,
  Record<string, never>,
  Computed,
  Record<string, never>
> = {
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
}

export default Vue.extend(options)
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
