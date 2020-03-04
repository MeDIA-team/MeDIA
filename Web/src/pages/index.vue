<template>
  <v-app>
    <v-app-bar app color="primary" hide-on-scroll>
      <v-toolbar-title class="headline white--text">
        {{ titleText }}
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
            {{ footerText }}
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
  data() {
    return {
      titleText: "MeDIA",
      footerText: "Copylight Text"
    }
  }
}
</script>

<style scoped>
#app {
  background: #f5f5f5;
}
</style>
