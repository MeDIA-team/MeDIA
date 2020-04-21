<template>
  <div>
    <v-data-table
      v-model="selectedEntries"
      :footer-props="footerProps"
      :headers="headers"
      :items="shownEntries"
      :loading="loading"
      :options.sync="options"
      :server-items-length="entryCount"
      calculate-widths
      class="elevation-2"
      disable-filtering
      item-key="sampleID"
      multi-sort
      show-select
    >
      <template
        v-for="parentDataType in parentDataTypes"
        #[parentDataType]="{ value }"
      >
        <v-icon v-if="value" :key="parentDataType">mdi-check</v-icon>
      </template>
      <template v-for="header in copyableHeaders" #[header]="{ value }">
        <div :key="header" @click="copyText(value)">
          {{ shortenText(value) }}
        </div>
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snackbar"
      :timeout="this.$store.state.const.snackbarTimeout"
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
      snackbar: false,
      snackbarText: "",
      subscribeMutations: [
        "filter/setSelectedProjects",
        "filter/setInputtedPatientIDs",
        "filter/setSelectedSexes",
        "filter/setInputtedBottomAge",
        "filter/setInputtedUpperAge",
        "filter/setSelectedDiseases",
        "filter/setInputtedSampleIDs",
        "filter/setInputtedBottomSamplingDate",
        "filter/setInputtedUpperSamplingDate",
        "filter/setInputtedDataTypes",
        "entry/setOptions"
      ]
    }
  },
  computed: {
    footerProps() {
      return { "items-per-page-options": this.$store.state.const.itemsPerPage }
    },
    options: {
      get() {
        return this.$store.state.entry.options
      },
      set(value) {
        this.$store.dispatch("entry/updateOptions", value)
      }
    },
    loading() {
      return this.$store.state.entry.loading
    },
    headers() {
      return this.$store.getters["entry/headers"]
    },
    shownEntries() {
      return this.$store.state.entry.shownEntries
    },
    entryCount() {
      return this.$store.state.entry.entryCount
    },
    selectedEntries: {
      get() {
        return this.$store.getters["entry/getSelectedEntries"]
      },
      set(value) {
        this.$store.dispatch("entry/updateSelectedSampleIDs", value)
      }
    },
    parentDataTypes() {
      return this.$store.state.init.dataTypes.map((ele) => "item." + ele)
    },
    copyableHeaders() {
      const headers = this.$store.state.selector.selectedRequiredFields.map(
        (field) => "item." + field
      )
      for (const field of this.$store.state.selector.selectedDataTypeFields) {
        if (!this.$store.state.init.dataTypes.includes(field)) {
          headers.push("item." + field)
        }
      }
      return headers
    }
  },
  mounted() {
    this.$store.dispatch("entry/updateEntries")
    this.$store.subscribe((mutation) => {
      if (this.subscribeMutations.includes(mutation.type)) {
        this.$store.dispatch("entry/updateEntries")
      }
      if (
        this.subscribeMutations
          .filter((ele) => ele !== "entry/setOptions")
          .includes(mutation.type)
      ) {
        this.$store.dispatch("entry/updatePageFirst")
      }
    })
  },
  methods: {
    copyText(text) {
      this.snackbar = true
      this.snackbarText = `Copied: ${text}`
      this.$copyText(text)
    },
    shortenText(text) {
      if (typeof text !== "string") {
        return text
      }
      return text.length > 20 ? text.slice(0, 20) + "..." : text
    }
  }
}
</script>
