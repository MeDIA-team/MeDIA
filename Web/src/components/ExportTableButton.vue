<template>
  <div>
    <v-btn color="white" outlined raise @click="exportTable">
      <v-icon>mdi-file-download-outline</v-icon>
      <div class="ml-2">Export Table</div>
    </v-btn>
    <v-dialog
      v-model="donwloading"
      max-width="480"
      persistent
      overlay-opacity="0.9"
    >
      <v-card
        :color="greyLighten5"
        class="d-flex flex-column align-center pt-2"
        height="140"
        style="border-radius: 24px;"
        width="480"
      >
        <v-progress-circular
          :color="color"
          class="mt-4 mb-2"
          indeterminate
        ></v-progress-circular>
        <p class="text-center info--text title font-regular">
          Now donwloading the table file...<br />
          Please wait...
        </p>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import colors from "vuetify/lib/util/colors"

export default {
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
    }
  },
  data() {
    return {
      greyLighten5: colors.grey.lighten5,
      donwloading: false
    }
  },
  methods: {
    async exportTable() {
      this.donwloading = true
      let content = ""
      const headers = this.$store.getters["selector/headers"]
      headers.forEach((header) => {
        content += header.value + "\t"
      })
      content = content.trim() + "\n"

      let selectedSampleIDs
      if (this.viewType === "sample") {
        selectedSampleIDs = this.$store.state.sampleEntry.selectedSampleIDs
      } else if (this.viewType === "patient") {
        const selectedSampleIDsSet = new Set()
        this.$store.state.patientEntry.selectedPatientIDs.forEach(
          (patientID) => {
            this.$store.state.patientEntry.patientIDAndSampleIDTable[
              patientID
            ].forEach((sampleID) => selectedSampleIDsSet.add(sampleID))
          }
        )
        selectedSampleIDs = Array.from(selectedSampleIDsSet)
      }

      let allDocs
      if (this.viewType === "sample") {
        allDocs = selectedSampleIDs.reduce(
          (arr, cur) => ({ ...arr, [cur]: {} }),
          {}
        )
      } else if (this.viewType === "patient") {
        allDocs = this.$store.state.patientEntry.selectedPatientIDs.reduce(
          (arr, cur) => ({ ...arr, [cur]: {} }),
          {}
        )
      }

      for (
        let i = 0;
        i < selectedSampleIDs.length;
        i += this.$store.state.const.dumpChunkSize
      ) {
        const sampleIDChunk = selectedSampleIDs.slice(
          i,
          i + this.$store.state.const.dumpChunkSize
        )
        const entryDocs = await this.$dataFetcher
          .fetchEntryDocs("sampleID", sampleIDChunk)
          .catch((err) => {
            throw err
          })

        if (this.viewType === "sample") {
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
        } else if (this.viewType === "patient") {
          entryDocs.forEach((doc) => {
            const patientID = doc.patientID
            const dataType = doc.dataType
            Object.entries(doc).forEach(([key, val]) => {
              if (
                this.$store.state.const.requiredFields
                  .map((item) => item.key)
                  .filter((key) => key !== "dataType")
                  .includes(key)
              ) {
                if (!(key in allDocs[patientID])) {
                  allDocs[patientID][key] = new Set()
                }
                allDocs[patientID][key].add(val)
              } else if (key === "dataType") {
                allDocs[patientID][dataType] = true
              } else {
                const dataTypeKey = dataType + "_" + key
                if (!(dataTypeKey in allDocs[patientID])) {
                  allDocs[patientID][dataTypeKey] = new Set()
                }
                allDocs[patientID][dataTypeKey].add(val)
              }
            })
          })
        }
      }

      if (this.viewType === "patient") {
        for (const patientID of Object.keys(allDocs)) {
          const entry = allDocs[patientID]
          for (const key of Object.keys(entry)) {
            const value = entry[key]
            if (typeof value === "object") {
              const joinedValue = Array.from(value).join(", ")
              allDocs[patientID][key] = joinedValue
            }
          }
        }
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
      this.donwloading = false
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
