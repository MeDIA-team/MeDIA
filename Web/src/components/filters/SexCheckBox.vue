<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="sex in sexes"
      :key="sex"
      v-model="selectedSexes"
      :label="sex"
      :value="sex"
      class="shrink my-0 mr-6 pt-0 align-center"
      hide-details
      style="width: 120px; height: 52px;"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  computed: {
    sexes() {
      return this.$store.state.init.sexes
    },
    selectedSexes: {
      get() {
        return this.$store.state.filter.selectedSexes
      },
      set(value) {
        this.$store.dispatch("filter/updateSelectedSexes", value)
      }
    }
  }
}
</script>
