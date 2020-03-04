<template>
  <div class="d-flex flex-row flex-wrap">
    <v-checkbox
      v-for="defaultColumn in defaultColumns"
      :key="defaultColumn"
      v-model="selectedDefaultColumns"
      :value="defaultColumn"
      :label="defaultColumn"
      hide-details
      class="shrink my-0 mr-4 pt-0 align-center"
      style="width: 200px; height: 52px;"
    ></v-checkbox>
  </div>
</template>

<script>
export const defaultColumns = [
  "Data ID",
  "Project ID",
  "Project Name",
  "Patient ID",
  "Sex",
  "Age",
  "Sample ID",
  "Sampling Date"
]

export default {
  data() {
    return {
      defaultColumns
    }
  },
  computed: {
    selectedDefaultColumns: {
      get() {
        return this.$store.state.selectedDefaultColumns
      },
      set(value) {
        this.$store.commit("updateSelectedDefaultColumns", value)
      }
    }
  }
}
</script>
