<template>
  <v-btn color="white" outlined @click="exportTable">
    <v-icon>mdi-file-download-outline</v-icon>
    <div class="ml-2">Export Table</div>
  </v-btn>
</template>

<script>
export default {
  methods: {
    async exportTable() {
      let content = ""
      this.$store.state.entry.headers.forEach((header) => {
        content += header.value + "\t"
      })
      content = content.trim() + "\n"

      const chunkSize = 100
      for (
        let i = 0;
        i < this.$store.state.entry.selectedEntries.length;
        i += chunkSize
      ) {
        const sampleIDChunk = this.$store.state.entry.selectedEntries.slice(
          i,
          i + chunkSize
        )
        const entriesDoc = await this.$dataFetcher.fetchEntriesDoc(
          sampleIDChunk
        )
        const entryObj = sampleIDChunk.reduce(
          (arr, cur) => ({ ...arr, [cur]: {} }),
          {}
        )
        entriesDoc.forEach((doc) => {
          const sampleID = doc.sampleID
          const dataType = doc.dataType
          Object.entries(doc).forEach(([key, val]) => {
            if (
              [
                "projectID",
                "projectName",
                "patientID",
                "sex",
                "age",
                "sampleID",
                "samplingDate"
              ].includes(key)
            ) {
              entryObj[sampleID][key] = val
            } else if (key === "dataType") {
              entryObj[sampleID][dataType] = true
            } else {
              entryObj[sampleID][dataType + "_" + key] = val
            }
          })
        })
        sampleIDChunk.forEach((sampleID) => {
          let line = ""
          const entry = entryObj[sampleID]
          this.$store.state.entry.headers.forEach((header) => {
            const ele = entry[header.value]
            line += typeof ele === "undefined" ? false : ele
            line += "\t"
          })
          content += line.trim() + "\n"
        })
      }

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
