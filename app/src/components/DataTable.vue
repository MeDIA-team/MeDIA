<template>
  <div>
    <v-data-table
      v-model="selected"
      disable-filtering
      :footer-props="footerProps"
      :headers="headers"
      :item-key="`${viewType}Id`"
      :items="contents"
      :loading="loading"
      multi-sort
      :options.sync="options"
      :server-items-length="count"
      show-select
    >
      <template
        v-for="parentDataType in parentDataTypes"
        #[parentDataType]="{ value }"
      >
        <v-icon v-if="value" :key="parentDataType"> mdi-check </v-icon>
      </template>
      <template v-for="header in copyableHeaders" #[header]="{ value }">
        <v-tooltip :key="header" open-delay="300" top>
          <template #activator="{ on }">
            <div v-on="on" @click="copyText(value)">
              {{ value | shortenText }}
            </div>
          </template>
          <span>Click to copy</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" bottom :color="color" :timeout="1000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DataOptions, DataTableHeader } from 'vuetify'

export default Vue.extend({
  filters: {
    shortenText(value: string) {
      if (typeof value !== 'string') {
        return value
      } else {
        return value.length > 20 ? value.slice(0, 20) + '...' : value
      }
    },
  },
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
      set(value: DataOptions) {
        this.$store.commit('entry/setOptions', {
          viewType: this.viewType,
          value,
        })
      },

      get(): DataOptions {
        return this.$store.state.entry[this.viewType].options
      },
    },

    count(): number {
      return this.$store.state.filter[this.viewType].counts[this.viewType]
        .filtered
    },

    headers(): DataTableHeader[] {
      const headers = [
        ...this.$store.getters['selector/requiredFieldHeaders']({
          viewType: this.viewType,
          dataConfig: this.$dataConfig,
        }),
        ...this.$store.getters['selector/dataTypeFieldHeaders']({
          viewType: this.viewType,
          dataConfig: this.$dataConfig,
        }),
      ]
      for (let i = 0; i < headers.length; i++) {
        if (
          !this.$store.state.selector.patient.dataTypes.includes(
            headers[i].value
          )
        ) {
          headers[i].class = 'header-min-width'
        } else {
          headers[i].width = '120px'
        }
      }
      return headers
    },

    contents(): DataEntry[] {
      return this.$store.state.entry[this.viewType].contents
    },

    selected: {
      set(value: DataEntry[]) {
        this.$store.commit('entry/setValue', {
          viewType: this.viewType,
          fieldType: 'selected',
          value,
        })
      },

      get(): DataEntry[] {
        return this.$store.state.entry[this.viewType].selected
      },
    },

    parentDataTypes(): string[] {
      return this.$store.getters['selector/parentDataTypes']({
        viewType: this.viewType,
      })
    },

    copyableHeaders(): string[] {
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
})
</script>

<style>
.header-min-width {
  min-width: 200px;
}
</style>
