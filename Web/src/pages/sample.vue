<template>
  <v-app>
    <header-bar color="primary" text="MeDIA Sample"></header-bar>

    <v-content>
      <v-container fluid>
        <tool-card class="mb-6" color="primary" view-type="sample"></tool-card>
        <!-- <data-table class="mb-6" color="primary" viewType="sample"></data-table> -->
      </v-container>
    </v-content>

    <footer-bar
      color="primary"
      :text="this.$store.state.const.footerText"
    ></footer-bar>
  </v-app>
</template>

<script>
// import DataTable from "~/components/DataTable"
import FooterBar from "~/components/FooterBar"
import HeaderBar from "~/components/HeaderBar"
import ToolCard from "~/components/ToolCard"

export default {
  components: {
    // DataTable,
    FooterBar,
    HeaderBar,
    ToolCard
  },
  async fetch({ store, error }) {
    const initActionQueue = [
      "sampleInit/initialize",
      "sampleFilter/initialize",
      "sampleSelector/initialize"
    ]
    for (const initAction of initActionQueue) {
      try {
        await store.dispatch(initAction)
      } catch (err) {
        error(err)
        return
      }
    }
  }
}
</script>

<style scoped>
#app {
  background: #f5f5f5;
}
</style>
