<template>
  <v-app>
    <v-app-bar app color="primary" absolute>
      <v-toolbar-title class="headline white--text">
        {{ this.$store.state.const.titleText }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <export-table-button></export-table-button>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <tool-card class="mb-6"></tool-card>
        <data-table class="mb-10"></data-table>
      </v-container>
    </v-content>

    <v-footer app color="primary" padless absolute height="30px">
      <div
        class="d-flex align-center justify-center"
        style="width: 100%; height: 100%;"
      >
        <div>
          <span class="block text-center caption white--text">
            {{ this.$store.state.const.footerText }}
          </span>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import DataTable from "~/components/DataTable"
import ExportTableButton from "~/components/ExportTableButton"
import ToolCard from "~/components/ToolCard"

export default {
  components: {
    DataTable,
    ExportTableButton,
    ToolCard
  },
  async fetch({ store, error }) {
    const initActionQueue = [
      "init/initialize",
      "filter/initialize",
      "selector/initialize"
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
