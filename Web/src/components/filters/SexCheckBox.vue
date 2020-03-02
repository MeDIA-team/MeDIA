<template>
  <div class="d-flex flex-row flex-wrap">
    <v-checkbox
      v-for="sex in sexes"
      :key="sex"
      v-model="selectedSexes"
      :value="sex"
      :label="sex"
      hide-details
      class="shrink my-0 mr-6 pt-0 align-center"
      style="width: 120px; height: 52px;"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  computed: {
    sexes() {
      return this.$store.state.sexes
    },
    selectedSexes: {
      get() {
        return this.$store.state.selectedSexes
      },
      set(value) {
        this.$store.commit("updateSelectedSexes", value)
      }
    }
  }
}
</script>

<style></style>
