<template>
  <v-autocomplete
    v-model="inputtedDataTypes"
    :items="dataTypes"
    :search-input.sync="searchInput"
    clearable
    hide-details
    hide-selected
    label="must have"
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
    inputtedDataTypes: {
      get() {
        return this.$store.state.filter.inputtedDataTypes
      },
      set(value) {
        this.$store.dispatch("filter/updateInputtedDataTypes", value)
      }
    },
    dataTypes() {
      return this.$store.state.init.dataTypes
    }
  },

  methods: {
    remove(item) {
      this.inputtedDataTypes = this.inputtedDataTypes.filter(
        (ele) => ele !== item
      )
    }
  }
}
</script>
