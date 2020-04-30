<template>
  <v-app-bar app :color="color" absolute>
    <nuxt-link to="/" color="secondary">
      <v-toolbar-title class="headline white--text">
        {{ text }}
      </v-toolbar-title>
    </nuxt-link>
    <v-spacer></v-spacer>
    <other-view-button :color="color" :view-type="viewType"></other-view-button>
    <export-table-button
      :color="color"
      :view-type="viewType"
      class="ml-4"
    ></export-table-button>
  </v-app-bar>
</template>

<script>
import ExportTableButton from "~/components/ExportTableButton.vue"
import OtherViewButton from "~/components/OtherViewButton.vue"
export default {
  components: {
    ExportTableButton,
    OtherViewButton
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

<style scoped>
a {
  text-decoration: none;
}
</style>
