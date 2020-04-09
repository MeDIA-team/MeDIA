<template>
  <v-autocomplete
    v-model="inputtedDataTypes"
    :items="dataTypes"
    chips
    clearable
    flat
    hide-details
    hide-selected
    label="must have"
    multiple
    outlined
    single-line
    solo
    style="max-width: 620px;"
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
      const removed = this.inputtedDataTypes.filter((ele) => ele !== item)
      this.inputtedDataTypes = removed
    }
  }
}
</script>

<style></style>
