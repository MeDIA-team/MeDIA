<template>
  <v-autocomplete
    v-model="inputtedSampleIDs"
    :items="sampleIDs"
    :search-input.sync="searchInput"
    clearable
    hide-details
    hide-selected
    label="is"
    multiple
    outlined
    single-line
    style="max-width: 660px;"
    @input="searchInput = null"
  >
    <template v-slot:selection="{ item }">
      <v-chip close label @click:close="remove(item)">
        {{ item }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  data() {
    return { searchInput: null }
  },
  computed: {
    inputtedSampleIDs: {
      get() {
        return this.$store.state.filter.inputtedSampleIDs
      },
      set(value) {
        this.$store.dispatch("filter/updateInputtedSampleIDs", value)
      }
    },
    sampleIDs() {
      return this.$store.state.init.sampleIDs
    }
  },
  methods: {
    remove(item) {
      this.inputtedSampleIDs = this.inputtedSampleIDs.filter(
        (ele) => ele !== item
      )
    }
  }
}
</script>
