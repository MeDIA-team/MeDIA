<template>
  <!-- <div>
    <v-data-table
      :headers="headers"
      :items="entries"
      :options.sync="options"
      :server-items-length="entryNum"
      :loading="loading"
      class="elevation-2"
      calculate-widths
      disable-filtering
      item-key="selectedEntries"
      multi-sort
      show-select
    ></v-data-table>
  </div> -->

  <div>
    <v-data-table
      :headers="headers"
      :items="entries"
      class="elevation-2"
      calculate-widths
      disable-filtering
      item-key="selectedEntries"
      multi-sort
      show-select
    ></v-data-table>
  </div>
</template>

<script>
export default {
  // data() {
  //   return {
  //     options: {}
  //   }
  // },
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
    // loading() {
    //   return this.$store.state.entry.loading
    // },
    selectedEntries: {
      get() {
        return this.$store.state.entry.selectedEntries
      },
      set(value) {
        this.$store.dispatch("entry/updateSelectedEntries", value)
      }
    }
  },
  // watch: {
  //   options: {
  //     handler() {
  //       this.updateOption()
  //     },
  //     deep: true
  //   }
  // },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (filterMutations.includes(mutation.type)) {
        this.fetchEntriesFromElasticsearch()
      } else if (selectorMutations.includes(mutation.type)) {
        this.updateHeaders()
      }
    })
    this.updateHeaders()
    this.fetchEntriesFromElasticsearch()
  },
  methods: {
    updateHeaders() {
      const headers = this.$store.state.selector.selectedDefaultColumns.map(
        (ele) => {
          return {
            text: ele,
            align: "start",
            sortable: true,
            value: labelToID(ele)
          }
        }
      )
      const childDataTypes = this.$store.state.selector.selectedDataTypesColumns
        .filter((ele) => ele.includes("_"))
        .map((ele) => ele.split("_", 2)[0])
      this.$store.state.selector.selectedDataTypesColumns.forEach((ele) => {
        if (ele.includes("_")) {
          headers.push({
            text: ele.replace("_", " "),
            align: "start",
            sortable: true,
            value: ele
          })
        } else if (!childDataTypes.includes(ele)) {
          headers.push({
            text: ele,
            align: "start",
            sortable: true,
            value: ele
          })
        }
      })
      this.$store.dispatch("entry/updateHeaders", headers)
    },
    async fetchEntriesFromElasticsearch() {
      // this.$store.dispatch("entry/updateLoading", true)
      // await this.$store.dispatch("entry/updateEntries", this.options)
      // this.$store.dispatch("entry/updateLoading", false)

      await this.$store.dispatch("entry/updateEntries")
    }
    // updateOption() {}
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
  "filter/setSelectedDataTypes"
]

const selectorMutations = [
  "selector/setSelectedDefaultColumns",
  "selector/setSelectedDataTypesColumns"
]

// "Project Name" や "Project ID" は Elasticsearch のなかでは、
// "projectName" や "projectID" のように管理されている。
// Label など人が見る場合は、前者のほうが都合がよく、
// Elasticsearch の中などでは、後者のほうが都合がよい。
// そのため、変換用の関数を定義する。

export const labelToID = (label) => {
  switch (label) {
    case "Project Name":
      return "projectName"
    case "Project ID":
      return "projectID"
    case "Patient ID":
      return "patientID"
    case "Sex":
      return "sex"
    case "Age":
      return "age"
    case "Sample ID":
      return "sampleID"
    case "Sampling Date":
      return "samplingDate"
    default:
      return label
  }
}

export const IDToLabel = (ID) => {
  switch (ID) {
    case "projectName":
      return "Project Name"
    case "projectID":
      return "Project ID"
    case "patientID":
      return "Patient ID"
    case "sex":
      return "Sex"
    case "age":
      return "Age"
    case "sampleID":
      return "Sample ID"
    case "samplingDate":
      return "Sampling Date"
    default:
      return ID
  }
}
</script>
