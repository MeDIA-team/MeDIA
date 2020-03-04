<template>
  <div class="d-flex flex-row flex-wrap">
    <v-checkbox
      v-for="dataType in dataTypes"
      :key="dataType"
      v-model="selectedDataTypes"
      :value="dataType"
      :label="dataType"
      hide-details
      class="shrink my-0 mr-4 pt-0 align-center"
      style="width: 200px; height: 52px;"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  computed: {
    dataTypes() {
      return this.$store.state.dataTypes
    },
    selectedDataTypes: {
      get() {
        return this.$store.state.selectedDataTypes
      },
      set(value) {
        this.$store.commit("updateSelectedDataTypes", value)
      }
    }
  }
}
</script>

<style></style>
