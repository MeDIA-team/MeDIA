<template>
  <div>
    <v-btn color="white" outlined raise @click="exportTable">
      <v-icon>mdi-file-download-outline</v-icon>
      <div class="ml-2" v-text="'Export Selected Entries'" />
    </v-btn>
  </div>
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import dayjs from 'dayjs'
import Vue from 'vue'

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
    exportTable() {
      let content = ''
      const headers: DataTableHeader[] = [
        ...this.$store.getters['selector/requiredFieldHeaders']({
          viewType: this.viewType,
          dataConfig: this.$dataConfig,
        }),
        ...this.$store.getters['selector/dataTypeFieldHeaders']({
          viewType: this.viewType,
        }),
      ]
      content += `${headers.map((header) => header.value).join('\t')}\n`
      const entries = this.$store.state.entry[this.viewType].selected
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
