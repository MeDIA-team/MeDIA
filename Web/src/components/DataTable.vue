<template>
  <div>
    <v-data-table
      :footer-props="footerProps"
      :headers="headers"
      :items="entries"
      :loading="loading"
      :options.sync="options"
      :server-items-length="entryNum"
      :value="selectedEntries"
      calculate-widths
      class="elevation-2"
      disable-filtering
      item-key="sampleID"
      multi-sort
      show-select
      @input="updateSelectedEntries($event)"
    >
      <template
        v-for="parentDataType in parentDataTypes"
        #[parentDataType]="{ value }"
      >
        <v-icon v-if="value" :key="parentDataType">mdi-check</v-icon>
      </template>
      <template v-for="header in copyHeaders" #[header]="{ value }">
        <div :key="header" @click="copyText(value)">
          {{ shortenText(value) }}
        </div>
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snackbar"
      :timeout="snackbarTimeout"
      bottom
      color="primary"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {},
      loading: true,
      footerProps: { "items-per-page-options": [10, 30, 100] },
      snackbar: false,
      snackbarText: "",
      snackbarTimeout: 1000
    }
  },
  computed: {
    headers() {
      return this.$store.state.entry.headers
    },
    entries() {
      return this.$store.state.entry.entries
    },
    entryNum() {
      return this.$store.state.entry.entryNum
    },
    selectedEntries: {
      get() {
        return this.$store.getters["entry/getSelectedEntries"]
      },
      set(value) {
        this.$store.dispatch("entry/updateSelectedEntriesFromTable", value)
      }
    },
    parentDataTypes() {
      return this.$store.state.init.dataTypes.map((ele) => "item." + ele)
    },
    copyHeaders() {
      const headers = this.$store.state.selector.selectedDefaultColumns.map(
        (header) => "item." + labelToID(header)
      )
      for (const header of this.$store.state.selector
        .selectedDataTypesColumns) {
        if (!this.$store.state.init.dataTypes.includes(header)) {
          headers.push("item." + header)
        }
      }

      return headers
    }
  },
  watch: {
    options: {
      handler() {
        this.fetchEntriesFromES()
      },
      deep: true
    }
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (selectorMutations.includes(mutation.type)) {
        this.updateHeaders()
      } else if (filterMutations.includes(mutation.type)) {
        this.options.page = 1
        this.fetchEntriesFromES()
      }
    })
    this.updateHeaders()
    this.fetchEntriesFromES()
  },
  methods: {
    updateHeaders() {
      const headers = this.$store.state.selector.selectedDefaultColumns.map(
        (ele) => {
          return {
            text: ele,
            align: "start",
            sortable: true,
            value: labelToID(ele),
            width: labelAndWidth[ele]
          }
        }
      )
      const selectedDataTypesColumnsSorted = []
      for (const dataType of this.$store.state.init.dataTypes) {
        if (
          this.$store.state.selector.selectedDataTypesColumns.includes(dataType)
        ) {
          selectedDataTypesColumnsSorted.push(dataType)
        }
        const metadataField = this.$store.state.init.dataTypesMetadataFields[
          dataType
        ]
        for (const field of metadataField) {
          if (
            this.$store.state.selector.selectedDataTypesColumns.includes(
              `${dataType}_${field}`
            )
          ) {
            selectedDataTypesColumnsSorted.push(`${dataType}_${field}`)
          }
        }
      }
      selectedDataTypesColumnsSorted.forEach((ele) => {
        if (ele.includes("_")) {
          headers.push({
            text: ele.replace("_", ": "),
            align: "start",
            sortable: false,
            value: ele
          })
        } else {
          headers.push({
            text: ele,
            align: "center",
            sortable: false,
            value: ele
          })
        }
      })
      this.$store.dispatch("entry/updateHeaders", headers)
    },
    async fetchEntriesFromES() {
      this.loading = true
      const queue = [
        this.$store.dispatch("entry/updateTotalSampleIDs"),
        this.$store.dispatch("entry/updateEntries", this.options)
      ]
      await Promise.all(queue)
      this.loading = false
    },
    copyText(text) {
      this.snackbar = true
      this.snackbarText = `Coppied: ${text}`
      this.$copyText(text)
    },
    shortenText(text) {
      if (typeof text === "undefined") {
        return text
      }
      return text.length >= 20 ? text.slice(0, 20) + "..." : text
    },
    updateSelectedEntries(event) {
      this.test = event.map((entry) => {
        return { sampleID: entry.sampleID }
      })
    }
  }
}

const filterMutations = [
  "filter/setSelectedProjects",
  "filter/setInputtedPatientID",
  "filter/setSelectedSexes",
  "filter/setInputtedBottomAge",
  "filter/setInputtedUpperAge",
  "filter/setInputtedSampleID",
  "filter/setInputtedBottomSamplingDate",
  "filter/setInputtedUpperSamplingDate",
  "filter/setInputtedDataTypes"
]

const selectorMutations = [
  "selector/setSelectedDefaultColumns",
  "selector/setSelectedDataTypesColumns"
]

const labelAndID = {
  "Project Name": "projectName",
  "Project ID": "projectID",
  "Patient ID": "patientID",
  Sex: "sex",
  Age: "age",
  "Sample ID": "sampleID",
  "Sampling Date": "samplingDate"
}

const labelToID = (label) => {
  return labelAndID[label] ? labelAndID[label] : label
}

// const IDAndLabel = Object.keys(labelAndID).reduce(
//   (acc, cur) => ({ ...acc, [labelAndID[cur]]: cur }),
//   {}
// )

// const IDToLabel = (ID) => {
//   return IDAndLabel[ID] ? IDAndLabel[ID] : ID
// }

const labelAndWidth = {
  "Project Name": 125,
  "Project ID": 105,
  "Patient ID": 105,
  Sex: 75,
  Age: 75,
  "Sample ID": 105,
  "Sampling Date": 135
}
</script>
