<template>
  <div>
    <v-btn color="white" outlined raise @click="exportTable">
      <v-icon>mdi-file-download-outline</v-icon>
      <div class="ml-2" v-text="'Export All Entries'" />
    </v-btn>
  </div>
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import dayjs from 'dayjs'
import Vue from 'vue'
import { allEntries } from '@/store/entry'

dayjs.locale('ja')

interface Methods {
  exportTable: () => void
}

interface Computed {
  viewType: string
  color: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Record<string, never>,
  Methods,
  Computed,
  Record<string, never>
> = {
  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
  },

  methods: {
    async exportTable() {
      let content = ''
      const headers: DataTableHeader[] = [
        ...this.$store.getters['selector/requiredFieldHeaders']({
          viewType: this.viewType,
          dataConfig: this.$dataConfig,
        }),
        ...this.$store.getters['selector/dataTypeFieldHeaders']({
          viewType: this.viewType,
          dataConfig: this.$dataConfig,
        }),
      ]
      content += `${headers.map((header) => header.value).join('\t')}\n`
      const entries = await allEntries({
        viewType: this.viewType as 'sample' | 'patient',
        axios: this.$axios,
        dataConfig: this.$dataConfig,
        rootState: this.$store.state,
        entryState: this.$store.state.entry,
      })
      for (const entry of entries) {
        const line = []
        for (const header of headers) {
          line.push(
            typeof entry[header.value] === 'undefined'
              ? false
              : entry[header.value]
          )
        }
        content += `${line.join('\t')}\n`
      }
      const blob = new Blob([content], { type: 'text/tsv' })
      const link = document.createElement('a')
      link.href = (window.URL || window.webkitURL).createObjectURL(blob)
      link.download = `MeDIA_output_${dayjs().format('YYYY-MM-DDTHHmmss')}.tsv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  },
}

export default Vue.extend(options)
</script>
