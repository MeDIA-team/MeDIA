<template>
  <div>
    <v-btn color="white" outlined raise @click="exportTable">
      <v-icon>mdi-file-download-outline</v-icon>
      <div class="ml-2">Export Table</div>
    </v-btn>
    <!-- <v-dialog
      v-model="downloading"
      max-width="480"
      persistent
      overlay-opacity="0.9"
    >
      <v-card
        :color="$colors.grey.lighten5"
        class="d-flex flex-column align-center pt-2"
        height="140"
        style="border-radius: 24px"
        width="480"
      >
        <v-progress-circular :color="color" class="mt-4 mb-2" indeterminate />
        <p class="text-center info--text title font-regular">
          Now downloading the table file...<br />
          Please wait...
        </p>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script lang="ts">
// import { DataTableHeader } from 'vuetify'
// import { fetchEntries } from '@/util/dataFetcher'
// import { requiredFields } from '@/store/selector'
// import dayjs from 'dayjs'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'

// dayjs.locale('ja')

type Data = {
  downloading: boolean
}

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

  data() {
    return {
      downloading: false,
    }
  },

  computed: {
    color() {
      return this.viewType === 'sample' ? 'primary' : 'secondary'
    },
  },

  methods: {
    // async exportTable() {
    exportTable() {
      //   this.downloading = true
      //   let content = ''
      //   const headers: DataTableHeader[] = this.$store.getters['selector/headers']
      //   headers.forEach((header) => {
      //     content += header.value + '\t'
      //   })
      //   content = content.trim() + '\n'
      //   const selectedIDs: string[] =
      //     this.viewType === 'sample'
      //       ? this.$store.state.sampleEntry.selectedSampleIDs
      //       : this.$store.state.patientEntry.selectedPatientIDs
      //   const allEntries: {
      //     [x: string]: { [x: string]: Set<string | number> | boolean | string }
      //   } = selectedIDs.reduce(
      //     (arr: { [x: string]: {} }, cur: string) => ({ ...arr, [cur]: {} }),
      //     {}
      //   )
      //   for (let i = 0; i < selectedIDs.length; i += 50) {
      //     const selectedIDChunk = selectedIDs.slice(i, i + 50)
      //     const entries = await fetchEntries(
      //       this.$axios,
      //       this.viewType === 'sample' ? 'sampleID' : 'patientID',
      //       selectedIDChunk
      //     )
      //     entries.forEach((entry) => {
      //       const id =
      //         this.viewType === 'sample' ? entry.sampleID : entry.patientID
      //       const dataType = entry.dataType
      //       Object.entries(entry).forEach(([field, val]) => {
      //         if (field === 'dataType') {
      //           allEntries[id][dataType] = true
      //         } else if (requiredFields.includes(field)) {
      //           if (!(field in allEntries[id])) {
      //             allEntries[id][field] = new Set()
      //           }
      //           (allEntries[id][field] as Set<string | number>).add(val)
      //         } else {
      //           const dataTypeKey = dataType + '_' + field
      //           if (!(dataTypeKey in allEntries[id])) {
      //             allEntries[id][dataTypeKey] = new Set()
      //           }
      //           (allEntries[id][dataTypeKey] as Set<string | number>).add(val)
      //         }
      //       })
      //     })
      //   }
      //   for (const id of Object.keys(allEntries)) {
      //     const entry = allEntries[id]
      //     for (const [field, val] of Object.entries(entry)) {
      //       if (typeof val !== 'boolean') {
      //         const joinedValue = Array.from(val).sort().join(', ')
      //         allEntries[id][field] = joinedValue
      //       }
      //     }
      //   }
      //   Object.values(allEntries).forEach((entry) => {
      //     let line = ''
      //     headers.forEach((header) => {
      //       const ele = entry[header.value]
      //       line += typeof ele === 'undefined' ? false : ele
      //       line += '\t'
      //     })
      //     content += line.trim() + '\n'
      //   })
      //   const blob = new Blob([content], { type: 'text/tsv' })
      //   const link = document.createElement('a')
      //   link.href = (window.URL || window.webkitURL).createObjectURL(blob)
      //   link.download = `MeDIA_output_${dayjs().format('yyyy-MM-ddTHH:mm')}.tsv`
      //   document.body.appendChild(link)
      //   link.click()
      //   document.body.removeChild(link)
      //   this.downloading = false
    },
  },
}

export default Vue.extend(options)
</script>
