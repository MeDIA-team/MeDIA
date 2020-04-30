<template>
  <v-app-bar app :color="color" absolute>
    <v-toolbar-title class="headline white--text">
      {{ text }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <export-table-button
      :color="color"
      :view-type="viewType"
    ></export-table-button>
  </v-app-bar>
</template>

<script>
import ExportTableButton from "~/components/ExportTableButton.vue"
export default {
  components: {
    ExportTableButton
  },
  props: {
    viewType: {
      type: String,
      default: "",
      require: true
    },
    color: {
      type: String,
      default: "",
      require: true
    },
    text: {
      type: String,
      default: "",
      require: true
    }
  }
}
</script>
