<template>
  <v-autocomplete
    v-model="inputtedProjectPatientIDs"
    :items="projectPatientIDs"
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
    inputtedProjectPatientIDs: {
      get() {
        return this.$store.state.filter.inputtedProjectPatientIDs
      },
      set(value) {
        this.$store.dispatch("filter/updateInputtedProjectPatientIDs", value)
      }
    },
    projectPatientIDs() {
      return this.$store.state.init.projectPatientIDs
    }
  },
  methods: {
    remove(item) {
      this.inputtedProjectPatientIDs = this.inputtedProjectPatientIDs.filter(
        (ele) => ele !== item
      )
    }
  }
}
</script>
