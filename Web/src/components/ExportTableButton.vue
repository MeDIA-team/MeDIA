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
      const headers = this.$store.getters["entry/headers"]
      headers.forEach((header) => {
        content += header.value + "\t"
      })
      content = content.trim() + "\n"

      const allDocs = this.$store.state.entry.selectedSampleIDs.reduce(
        (arr, cur) => ({ ...arr, [cur]: {} }),
        {}
      )
      for (
        let i = 0;
        i < this.$store.state.entry.selectedSampleIDs.length;
        i += this.$store.state.const.dumpChunkSize
      ) {
        const sampleIDChunk = this.$store.state.entry.selectedSampleIDs.slice(
          i,
          i + this.$store.state.const.dumpChunkSize
        )
        const entryDocs = await this.$dataFetcher
          .fetchEntryDocs(sampleIDChunk)
          .catch((err) => {
            throw err
          })
        entryDocs.forEach((doc) => {
          const sampleID = doc.sampleID
          const dataType = doc.dataType
          Object.entries(doc).forEach(([key, val]) => {
            if (
              this.$store.state.const.requiredFields
                .map((item) => item.key)
                .filter((key) => key !== "dataType")
                .includes(key)
            ) {
              allDocs[sampleID][key] = val
            } else if (key === "dataType") {
              allDocs[sampleID][dataType] = true
            } else {
              allDocs[sampleID][dataType + "_" + key] = val
            }
          })
        })
      }
      Object.values(allDocs).forEach((entry) => {
        let line = ""
        headers.forEach((header) => {
          const ele = entry[header.value]
          line += typeof ele === "undefined" ? false : ele
          line += "\t"
        })
        content += line.trim() + "\n"
      })

      const blob = new Blob([content], { type: "text/tsv" })
      const link = document.createElement("a")
      link.href = (window.URL || window.webkitURL).createObjectURL(blob)
      const now = new Date()
      link.download = `MeDIA_output_${formatDate(now, "yyyy-MM-ddTHH:mm")}.tsv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

const formatDate = (date, format) => {
  format = format.replace(/yyyy/g, date.getFullYear())
  format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/dd/g, ("0" + date.getDate()).slice(-2))
  format = format.replace(/HH/g, ("0" + date.getHours()).slice(-2))
  format = format.replace(/mm/g, ("0" + date.getMinutes()).slice(-2))
  format = format.replace(/ss/g, ("0" + date.getSeconds()).slice(-2))
  format = format.replace(/SSS/g, ("00" + date.getMilliseconds()).slice(-3))

  return format
}
</script>
