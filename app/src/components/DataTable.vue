<template>
  <div>
    <v-data-table
      v-model="selected"
      :footer-props="footerProps"
      :headers="headers"
      :item-key="itemKey"
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
      <!-- <template
        v-for="parentDataType in parentDataTypes"
        #[parentDataType]="{ value }"
      >
        <v-icon v-if="value" :key="parentDataType">mdi-check</v-icon>
      </template>
      <template v-for="header in copyableHeaders" #[header]="{ value }">
        <div :key="header" @click="copyText(value)">
          {{ shortenText(value) }}
        </div>
      </template> -->
    </v-data-table>
    {{ options }}
    {{ footerProps }}
    <v-snackbar v-model="snackbar" :color="color" :timeout="1000" bottom>
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TypedStore } from '@/store'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { Pagination } from '@/store/entry'
import { DataOptions, DataTableHeader } from 'vuetify'
import { Entry } from '@/types/entry'

type Data = {
  snackbar: boolean
  snackbarText: string
}

type Methods = {
  copyText(text: string): void
  shortenText(text: string): string
}

type Computed = {
  color: string
  loading: boolean
  options: DataOptions
  footerProps: {
    'items-per-page-options': number[]
    pagination: Pagination
  }
  count: number
  headers: DataTableHeader[]
  contents: Entry[]
  itemKey: string
  selected: Entry[]
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
  props: {
    viewType: {
      type: String,
      required: true,
      validator: (val: string) => {
        return ['sample', 'patient'].includes(val)
      },
    },
  },

  data() {
    return {
      snackbar: false,
      snackbarText: '',
    }
  },

  computed: {
    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
    loading: {
      set(value) {
        this.$store.commit('entry/setLoading', {
          viewType: this.viewType,
          value,
        })
      },
      get() {
        return (this.$store as TypedStore).state.entry[
          this.viewType as 'sample' | 'patient'
        ].loading
      },
    },
    options: {
      set(value) {
        this.$store.commit('entry/setOptions', {
          viewType: this.viewType,
          value,
        })
      },
      get() {
        return (this.$store as TypedStore).state.entry[
          this.viewType as 'sample' | 'patient'
        ].options
      },
    },
    footerProps: {
      set(value) {
        this.$store.commit('entry/setPagination', {
          viewType: this.viewType,
          value: value.pagination,
        })
      },
      get() {
        return {
          'items-per-page-options': [10, 30, 100],
          pagination: (this.$store as TypedStore).state.entry[
            this.viewType as 'sample' | 'patient'
          ].pagination,
        }
      },
    },
    count() {
      return (this.$store as TypedStore).state.entry[
        this.viewType as 'sample' | 'patient'
      ].count
    },
    headers() {
      return this.$store.getters['selector/headers']({
        viewType: this.viewType,
      })
    },
    contents() {
      return (this.$store as TypedStore).state.entry[
        this.viewType as 'sample' | 'patient'
      ].contents
    },
    itemKey() {
      return `${this.viewType}ID`
    },
    selected: {
      set(value) {
        this.$store.commit('entry/setSelected', {
          viewType: this.viewType,
          value,
        })
      },
      get() {
        return (this.$store as TypedStore).state.entry[
          this.viewType as 'sample' | 'patient'
        ].selected
      },
    },
    // parentDataTypes() {
    //   return this.$store.state.init.dataTypes.map(
    //     (ele: string) => 'item.' + ele
    //   )
    // },
    // copyableHeaders() {
    //   const headers = this.$store.state.selector.requiredFields.map(
    //     (field: string) => 'item.' + field
    //   )
    //   // @ts-ignore
    //   for (const field of this.$store.state.selector.dataTypeFields) {
    //     // @ts-ignore
    //     if (!this.$store.state.init.dataTypes.includes(field)) {
    //       headers.push('item.' + field)
    //     }
    //   }
    //   return headers
    // },
  },

  mounted() {
    this.$store.dispatch('entry/updateEntries', {
      viewType: this.viewType,
      axios: this.$axios,
    })
    this.$store.dispatch('entry/updateEntryCount', {
      viewType: this.viewType,
      axios: this.$axios,
    })
    const subscribeMutations = [
      'filter/setFilterTextField',
      'filter/setFilterCheckBoxField',
      'filter/setFilterChipField',
      'filter/resetFilter',
      'entry/setOptions',
    ]
    this.$store.subscribe((mutation) => {
      if (subscribeMutations.includes(mutation.type)) {
        this.$store.dispatch('entry/updateEntries', {
          viewType: this.viewType,
          axios: this.$axios,
        })
        this.$store.dispatch('entry/updateEntryCount', {
          viewType: this.viewType,
          axios: this.$axios,
        })
      }
    })
  },

  methods: {
    copyText(text: string) {
      this.snackbar = true
      this.snackbarText = `Copied: ${text}`
      this.$copyText(text)
    },

    shortenText(text: string) {
      if (typeof text !== 'string') {
        return text
      }
      return text.length > 20 ? text.slice(0, 20) + '...' : text
    },
  },
}

export default Vue.extend(options)
</script>
