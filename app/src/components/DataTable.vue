<template>
  <div>
    <v-data-table
      v-model="selected"
      :footer-props="footerProps"
      :headers="headers"
      :item-key="`${viewType}Id`"
      :items="contents"
      :loading="loading"
      :options.sync="options"
      :server-items-length="count"
      calculate-widths
      class="elevation-2"
      disable-filtering
      multi-sort
      show-select
    >
      <template
        v-for="parentDataType in parentDataTypes"
        #[parentDataType]="{ value }"
      >
        <v-icon v-if="value" :key="parentDataType"> mdi-check </v-icon>
      </template>
      <template v-for="header in copyableHeaders" #[header]="{ value }">
        <div :key="header" @click="copyText(value)">
          {{ value }}
          <!-- {{ value | shortenText }} -->
        </div>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" :color="color" :timeout="1000" bottom>
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { DataOptions, DataTableHeader } from 'vuetify'

interface Data {
  snackbar: boolean
  snackbarText: string
  footerProps: {
    'items-per-page-options': number[]
  }
  loading: boolean
}

interface Methods {
  copyText(text: string): void
}

interface Computed {
  viewType: string
  color: string
  options: DataOptions
  count: number
  headers: DataTableHeader[]
  contents: DataEntry[]
  selected: DataEntry[]
  parentDataTypes: string[]
  copyableHeaders: string[]
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Record<string, never>
> = {
  data() {
    return {
      snackbar: false,
      snackbarText: '',
      footerProps: {
        'items-per-page-options': [10, 30, 100],
      },
      loading: false,
    }
  },

  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },

    options: {
      set(value) {
        this.$store.commit('entry/setOptions', {
          viewType: this.viewType,
          value,
        })
      },

      get() {
        return this.$store.state.entry[this.viewType].options
      },
    },

    count() {
      return this.$store.state.filter[this.viewType].counts[this.viewType]
        .filtered
    },

    headers() {
      return [
        ...this.$store.getters['selector/requiredFieldHeaders']({
          viewType: this.viewType,
          dataConfig: this.$dataConfig,
        }),
        ...this.$store.getters['selector/dataTypeFieldHeaders']({
          viewType: this.viewType,
          dataConfig: this.$dataConfig,
        }),
      ]
    },

    contents() {
      return this.$store.state.entry[this.viewType].contents
    },

    selected: {
      set(value) {
        this.$store.commit('entry/setValue', {
          viewType: this.viewType,
          fieldType: 'selected',
          value,
        })
      },

      get() {
        return this.$store.state.entry[this.viewType].selected
      },
    },

    parentDataTypes() {
      return this.$store.getters['selector/parentDataTypes']({
        viewType: this.viewType,
      })
    },

    copyableHeaders() {
      return this.$store.getters['selector/copyableHeaders']({
        viewType: this.viewType,
      })
    },
  },

  methods: {
    copyText(text: string) {
      this.snackbar = true
      this.snackbarText = `Copied: ${text}`
      this.$copyText(text)
    },
  },

  filters: {
    shortenText(value: string) {
      if (typeof value !== 'string') {
        return value
      } else {
        return value.length > 20 ? value.slice(0, 20) + '...' : value
      }
    },
  },
}

export default Vue.extend(options)
</script>
