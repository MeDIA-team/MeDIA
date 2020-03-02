<template>
  <div class="d-flex flex-row flex-wrap">
    <v-checkbox
      v-for="project in projects"
      :key="project"
      v-model="selectedProjects"
      :value="project"
      :label="project"
      hide-details
      class="shrink my-0 mr-6 pt-0 align-center"
      style="width: 220px; height: 52px;"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  computed: {
    projects() {
      return this.$store.state.projects
    },
    selectedProjects: {
      get() {
        return this.$store.state.selectedProjects
      },
      set(value) {
        this.$store.commit("updateSelectedProjects", value)
      }
    }
  }
}
</script>

<style></style>
