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
    <export-table-button class="ml-4" :color="color" :view-type="viewType" />
  </v-app-bar>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import ExportTableButton from '@/components/ExportTableButton.vue'
import Vue from 'vue'

type Data = Record<string, never>

type Methods = Record<string, never>

type Computed = {
  color: string
  headerText: string
  anotherViewTo: string
  anotherViewButtonIcon: string
  anotherViewButtonText: string
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
  components: {
    ExportTableButton,
  },
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
