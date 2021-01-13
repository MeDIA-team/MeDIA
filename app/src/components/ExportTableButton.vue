<template>
  <div>
    <v-btn color="white" outlined raise @click="exportTable">
      <v-icon>mdi-file-download-outline</v-icon>
      <div class="ml-2">Export Table</div>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { TypedStore } from '@/store'
import dayjs from 'dayjs'
import Vue from 'vue'

dayjs.locale('ja')

type Data = Record<never, never>

type Methods = {
  exportTable: () => void
}

type Computed = {
  color: string
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

  computed: {
    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
  },

  methods: {
    exportTable() {
      let content = ''
      const headers: DataTableHeader[] = this.$store.getters[
        'selector/headers'
      ]({ viewType: this.viewType })
      content += `${headers.map((header) => header.value).join('\t')}\n`

      const selectedEntries = (this.$store as TypedStore).state.entry[
        this.viewType as 'sample' | 'patient'
      ].selected
      for (const entry of selectedEntries) {
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
