<template>
  <div>
    <v-data-table
      v-model="selectedEntries"
      :footer-props="footerProps"
      :headers="headers"
      :item-key="itemKey"
      :items="shownEntries"
      :loading="loading"
      :options.sync="options"
      :server-items-length="entryCount"
      calculate-widths
      class="elevation-2"
      disable-filtering
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
      subscribeMutations: [
        "filter/setProjects",
        "filter/setPatientIDs",
        "filter/setProjectPatientIDs",
        "filter/setSexes",
        "filter/setBottomAge",
        "filter/setUpperAge",
        "filter/setDiseases",
        "filter/setSampleIDs",
        "filter/setBottomSamplingDate",
        "filter/setUpperSamplingDate",
        "filter/setDataTypes",
        "filter/initialize",
        `${this.viewType}Entry/setOptions`
      ]
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
      return this.$store.state[`${this.viewType}Entry`][`${this.viewType}Count`]
    },
    itemKey() {
      return `${this.viewType}ID`
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
        this.$store.dispatch(`${this.viewType}Entry/updateSelectedIDs`, value)
      }
    },
    footerProps() {
      return { "items-per-page-options": this.$store.state.const.itemsPerPage }
    },
    parentDataTypes() {
      return this.$store.state.init.dataTypes.map((ele) => "item." + ele)
    },
    copyableHeaders() {
      const headers = this.$store.state.selector.requiredFields.map(
        (field) => "item." + field
      )
      for (const field of this.$store.state.selector.dataTypeFields) {
        if (!this.$store.state.init.dataTypes.includes(field)) {
          headers.push("item." + field)
        }
      }
      return headers
    }
  },
  mounted() {
    this.$store.dispatch(`${this.viewType}Entry/updateEntries`)
    this.$store.subscribe((mutation) => {
      if (this.subscribeMutations.includes(mutation.type)) {
        this.$store.dispatch(`${this.viewType}Entry/updateEntries`)
      }
      if (
        this.subscribeMutations
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
