<template>
  <v-app style="background: #f5f5f5;">
    <v-app-bar app color="primary">
      <v-toolbar-title class="headline white--text">MeDIA</v-toolbar-title>
      <v-spacer></v-spacer>
      <export-table-button></export-table-button>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <tool-card class="mb-6"></tool-card>
        <data-table></data-table>
      </v-container>
    </v-content>
    <v-footer app color="primary" padless>
      <v-col class="text-center white--text caption" cols="12">
        Copylight Text
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import ExportTableButton from "~/components/ExportTableButton"
import ToolCard from "~/components/ToolCard"
import DataTable from "~/components/DataTable"

export default {
  components: {
    "export-table-button": ExportTableButton,
    "tool-card": ToolCard,
    "data-table": DataTable
  }
}
</script>
