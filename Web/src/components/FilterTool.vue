<template>
  <div class="d-flex">
    <div class="d-flex flex-column">
      <div
        v-for="filterKey in filterKeys"
        :key="filterKey"
        class="d-flex flex-column"
      >
        <div class="d-flex">
          <div class="d-flex align-center" style="min-width: 140px;">
            <span class="grey--text text--darken-3 font-weight-medium">
              {{ filterKey }}
            </span>
          </div>
          <project-check-box v-if="filterKey === 'Project'"></project-check-box>
          <patient-id-chip
            v-else-if="filterKey === 'Patient ID'"
            class="my-2"
          ></patient-id-chip>
          <project-patient-id-chip
            v-else-if="filterKey === 'Project Patient ID'"
            class="my-2"
          ></project-patient-id-chip>
          <sex-check-box v-else-if="filterKey === 'Sex'"></sex-check-box>
          <age-text-field v-else-if="filterKey === 'Age'"></age-text-field>
          <disease-check-box
            v-else-if="filterKey === 'Disease'"
          ></disease-check-box>
          <sample-id-chip
            v-else-if="filterKey === 'Sample ID'"
            class="my-2"
          ></sample-id-chip>
          <sampling-date-text-field
            v-else-if="filterKey === 'Sampling Date'"
          ></sampling-date-text-field>
          <data-type-chip
            v-else-if="filterKey === 'Data Type'"
            class="mt-2"
          ></data-type-chip>
        </div>
      </div>
      <v-btn
        class="mt-4"
        color="secondary"
        max-width="160"
        min-width="160"
        outlined
        @click="setInitialState"
        >Set Initial State</v-btn
      >
    </div>
    <div class="d-flex flex-column ml-auto mr-10">
      <entry-count-chart></entry-count-chart>
      <patient-count-chart class="mt-4"></patient-count-chart>
    </div>
  </div>
</template>

<script>
import ProjectCheckBox from "~/components/filters/ProjectCheckBox"
import PatientIDChip from "~/components/filters/PatientIDChip"
import SexCheckBox from "~/components/filters/SexCheckBox"
import AgeTextField from "~/components/filters/AgeTextField"
import DiseaseCheckBox from "~/components/filters/DiseaseCheckBox"
import SampleIDChip from "~/components/filters/SampleIDChip"
import SamplingDateTextField from "~/components/filters/SamplingDateTextField"
import DataTypeChip from "~/components/filters/DataTypeChip"
import EntryCountChart from "~/components/filters/EntryCountChart"
import PatientCountChart from "~/components/filters/PatientCountChart"
import ProjectPatientIDChip from "~/components/filters/ProjectPatientIDChip"

export default {
  components: {
    ProjectCheckBox,
    "patient-id-chip": PatientIDChip,
    SexCheckBox,
    AgeTextField,
    DiseaseCheckBox,
    "sample-id-chip": SampleIDChip,
    SamplingDateTextField,
    EntryCountChart,
    PatientCountChart,
    DataTypeChip,
    "project-patient-id-chip": ProjectPatientIDChip
  },
  data() {
    return {
      filterKeys: [
        "Project",
        "Patient ID",
        "Project Patient ID",
        "Sex",
        "Age",
        "Disease",
        "Sample ID",
        "Sampling Date",
        "Data Type"
      ]
    }
  },
  methods: {
    setInitialState() {
      this.$store.dispatch("filter/initialize")
    }
  }
}
</script>
