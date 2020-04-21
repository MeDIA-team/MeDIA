<template>
  <v-autocomplete
    v-model="inputtedPatientIDs"
    :items="patientIDs"
    :search-input.sync="searchInput"
    clearable
    hide-details
    hide-selected
    label="should have"
    multiple
    outlined
    single-line
    style="max-width: 620px;"
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
    inputtedPatientIDs: {
      get() {
        return this.$store.state.filter.inputtedPatientIDs
      },
      set(value) {
        this.$store.dispatch("filter/updateInputtedPatientIDs", value)
      }
    },
    patientIDs() {
      return this.$store.state.entry.processedPatientIDs
    }
  },
  methods: {
    remove(item) {
      this.inputtedPatientIDs = this.inputtedPatientIDs.filter(
        (ele) => ele !== item
      )
    }
  }
}
</script>
