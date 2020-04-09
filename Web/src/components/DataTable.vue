<template>
  <v-data-table
    v-model="selectedEntries"
    :footer-props="footerProps"
    :headers="headers"
    :items="entries"
    :loading="loading"
    :options.sync="options"
    :server-items-length="entryNum"
    calculate-widths
    class="elevation-2"
    disable-filtering
    item-key="sampleID"
    multi-sort
    show-select
  >
    <template
      v-for="parentDataType in parentDataTypes"
      #[parentDataType]="{ item }"
    >
      <v-icon v-if="item[parentDataType.slice(5)]" :key="parentDataType"
        >mdi-check</v-icon
      >
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      options: {},
      loading: true,
      footerProps: { "items-per-page-options": [10, 30, 100] }
    }
  },
  computed: {
    headers() {
      return this.$store.state.entry.headers
    },
    entries() {
      return this.$store.getters["entry/fixedEntries"]
    },
    entryNum() {
      return this.$store.state.entry.entryNum
    },
    selectedEntries: {
      get() {
        return this.$store.state.entry.selectedEntries
      },
      set(value) {
        this.$store.dispatch("entry/updateSelectedEntries", value)
      }
    },
    parentDataTypes() {
      return this.$store.state.init.dataTypes.map((ele) => "item." + ele)
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
      const dataTypesHaveChild = this.$store.state.selector.selectedDataTypesColumns
        .filter((ele) => ele.includes("_"))
        .map((ele) => ele.split("_", 2)[0])
      this.$store.state.selector.selectedDataTypesColumns.forEach((ele) => {
        if (ele.includes("_")) {
          headers.push({
            text: ele.replace("_", ": "),
            align: "start",
            sortable: false,
            value: ele
          })
        } else if (!dataTypesHaveChild.includes(ele)) {
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
        this.$store.dispatch("entry/updateEntryNum"),
        this.$store.dispatch("entry/updateEntries", this.options)
      ]
      await Promise.all(queue)
      this.loading = false
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
