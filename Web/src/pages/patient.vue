<template>
  <v-app>
    <header-bar
      :color="color"
      :text="headerLabel"
      :view-type="viewType"
    ></header-bar>

    <v-content>
      <v-container fluid>
        <tool-card
          :color="color"
          :view-type="viewType"
          class="mb-6"
        ></tool-card>
        <data-table
          :color="color"
          :view-type="viewType"
          class="mb-6"
        ></data-table>
      </v-container>
    </v-content>

    <footer-bar
      :color="color"
      :text="this.$store.state.const.footerText"
    ></footer-bar>
  </v-app>
</template>

<script>
import DataTable from "~/components/DataTable"
import FooterBar from "~/components/FooterBar"
import HeaderBar from "~/components/HeaderBar"
import ToolCard from "~/components/ToolCard"

export default {
  components: {
    DataTable,
    FooterBar,
    HeaderBar,
    ToolCard
  },
  async fetch({ store, error }) {
    const initActionQueue = [
      "init/initialize",
      "filter/initialize",
      "selector/initialize",
      "patientEntry/initialize"
    ]
    for (const initAction of initActionQueue) {
      try {
        await store.dispatch(initAction)
      } catch (err) {
        error(err)
        return
      }
    }
  },
  data() {
    return {
      headerLabel: "MeDIA Patient",
      viewType: "patient",
      color: "secondary"
    }
  }
}
</script>

<style scoped>
#app {
  background: #f5f5f5;
}
</style>
