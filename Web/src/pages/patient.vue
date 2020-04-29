<template>
  <v-app>
    <header-bar color="secondary" text="MeDIA Patient"></header-bar>

    <v-content>
      <v-container fluid>
        Patient
        <!-- <tool-card class="mb-6"></tool-card>
        <data-table class="mb-6"></data-table> -->
      </v-container>
    </v-content>

    <footer-bar
      color="secondary"
      :text="this.$store.state.const.footerText"
    ></footer-bar>
  </v-app>
</template>

<script>
// import DataTable from "~/components/DataTable"
import FooterBar from "~/components/FooterBar"
import HeaderBar from "~/components/HeaderBar"
// import ToolCard from "~/components/ToolCard"

export default {
  components: {
    // DataTable,
    FooterBar,
    HeaderBar
    // ToolCard
  }
  // async fetch({ store, error }) {
  //   const initActionQueue = [
  //     "init/initialize",
  //     "filter/initialize",
  //     "selector/initialize"
  //   ]
  //   for (const initAction of initActionQueue) {
  //     try {
  //       await store.dispatch(initAction)
  //     } catch (err) {
  //       error(err)
  //       return
  //     }
  //   }
  // }
}
</script>

<style scoped>
#app {
  background: #f5f5f5;
}
</style>
