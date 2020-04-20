<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-model="selectedProjects"
      :key="project"
      :label="project"
      :value="project"
      class="shrink my-0 mr-4 pt-0 align-center"
      hide-details
      style="width: 200px; height: 52px;"
      v-for="project in projects"
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  computed: {
    projects() {
      return this.$store.state.init.projects
    },
    selectedProjects: {
      get() {
        return this.$store.state.filter.selectedProjects
      },
      set(value) {
        this.$store.dispatch("filter/updateSelectedProjects", value)
      }
    }
  }
}
</script>

<style></style>
