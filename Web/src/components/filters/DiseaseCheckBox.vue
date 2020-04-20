<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="disease in diseases"
      :key="disease"
      v-model="selectedDiseases"
      :label="disease"
      :value="disease"
      class="shrink my-0 mr-6 pt-0 align-center"
      hide-details
      style="width: 120px; height: 52px;"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  computed: {
    diseases() {
      return this.$store.state.init.diseases
    },
    selectedDiseases: {
      get() {
        return this.$store.state.filter.selectedDiseases
      },
      set(value) {
        this.$store.dispatch("filter/updateSelectedDiseases", value)
      }
    }
  }
}
</script>
