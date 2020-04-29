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
      :color="color"
      :timeout="this.$store.state.const.snackbarTimeout"
      bottom
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    viewType: {
      type: String,
      default: "",
      require: true
    },
    color: {
      type: String,
      default: "",
      require: true
    }
  },
  data() {
    return {
      snackbar: false,
      snackbarText: "",
      subscribeMutations: {
        sample: [
          "sampleFilter/setProjects",
          "sampleFilter/setPatientIDs",
          "sampleFilter/setProjectPatientIDs",
          "sampleFilter/setSexes",
          "sampleFilter/setBottomAge",
          "sampleFilter/setUpperAge",
          "sampleFilter/setDiseases",
          "sampleFilter/setSampleIDs",
          "sampleFilter/setBottomSamplingDate",
          "sampleFilter/setUpperSamplingDate",
          "sampleFilter/setDataTypes",
          "sampleFilter/initialize",
          "sampleEntry/setOptions"
        ]
      }
    }
  },
  computed: {
    loading() {
      return this.$store.state[`${this.viewType}Entry`].loading
    },
    shownEntries() {
      return this.$store.state[`${this.viewType}Entry`].shownEntries
    },
    entryCount() {
      return this.$store.state[`${this.viewType}Entry`].entryCount
    },
    headers() {
      return this.$store.getters[`${this.viewType}Entry/headers`]
    },
    options: {
      get() {
        return this.$store.state[`${this.viewType}Entry`].options
      },
      set(value) {
        this.$store.commit(`${this.viewType}Entry/setOptions`, value)
      }
    },
    selectedEntries: {
      get() {
        return this.$store.getters[`${this.viewType}Entry/getSelectedEntries`]
      },
      set(value) {
        this.$store.dispatch(
          `${this.viewType}Entry/updateSelectedSampleIDs`,
          value
        )
      }
    },
    footerProps() {
      return { "items-per-page-options": this.$store.state.const.itemsPerPage }
    },
    parentDataTypes() {
      return this.$store.state[`${this.viewType}Init`].dataTypes.map(
        (ele) => "item." + ele
      )
    },
    copyableHeaders() {
      const headers = this.$store.state[
        `${this.viewType}Selector`
      ].requiredFields.map((field) => "item." + field)
      for (const field of this.$store.state[`${this.viewType}Selector`]
        .dataTypeFields) {
        if (
          !this.$store.state[`${this.viewType}Init`].dataTypes.includes(field)
        ) {
          headers.push("item." + field)
        }
      }
      return headers
    }
  },
  mounted() {
    this.$store.dispatch(`${this.viewType}Entry/updateEntries`)
    this.$store.subscribe((mutation) => {
      if (this.subscribeMutations[this.viewType].includes(mutation.type)) {
        this.$store.dispatch(`${this.viewType}Entry/updateEntries`)
      }
      if (
        this.subscribeMutations[this.viewType]
          .filter((ele) => ele !== `${this.viewType}Entry/setOptions`)
          .includes(mutation.type)
      ) {
        this.$store.commit(`${this.viewType}Entry/setPageFirst`)
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
