<template>
  <v-btn color="white" outlined @click="exportTable">
    <v-icon>mdi-file-download-outline</v-icon>
    <div class="ml-2">Export Table</div>
  </v-btn>
</template>

<script>
export default {
  methods: {
    exportTable() {
      confirm("Clicked Export Table Button")
    }
  }
}
</script>
