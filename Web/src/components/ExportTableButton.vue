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
      let content = ""
      this.$store.state.entry.headers.forEach((header) => {
        content += header.value + "\t"
      })
      content = content.trim() + "\n"
      this.$store.state.entry.selectedEntries.forEach((entry) => {
        let line = ""
        this.$store.state.entry.headers.forEach((header) => {
          const ele =
            entry[
              ["patientID", "sampleID"].includes(header.value)
                ? header.value + "All"
                : header.value
            ]
          line += typeof ele === "undefined" ? false : ele
          line += "\t"
        })
        content += line.trim() + "\n"
      })

      const blob = new Blob([content], { type: "text/tsv" })
      const link = document.createElement("a")
      link.href = (window.URL || window.webkitURL).createObjectURL(blob)
      link.download = "MeDIA_output.tsv"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>
