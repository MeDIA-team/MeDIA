<template>
  <div class="d-flex">
    <div class="d-flex flex-column">
      <div v-for="field in fields" :key="field.label" class="d-flex">
        <div class="d-flex align-center" style="min-width: 140px;">
          <span class="info--text font-weight-medium">
            {{ field.label }}
          </span>
        </div>
        <div v-if="field.type === 'check'">
          <check-box-field
            :color="color"
            :contents-key="field.contentsKey"
            :selected-contents-commit="field.selectedContentsCommit"
            :selected-contents-key="field.selectedContentsKey"
          ></check-box-field>
        </div>
        <div v-else-if="field.type === 'chip'" class="my-2">
          <chip-field
            :color="color"
            :box-label="field.boxLabel"
            :contents-key="field.contentsKey"
            :field-width="field.fieldWidth"
            :selected-contents-commit="field.selectedContentsCommit"
            :selected-contents-key="field.selectedContentsKey"
          ></chip-field>
        </div>
        <div v-else-if="field.type === 'text'">
          <text-field
            :box-width="field.boxWidth"
            :color="color"
            :field-type="field.fieldType"
            :inputted-bottom-value-commit="field.inputtedBottomValueCommit"
            :inputted-bottom-value-key="field.inputtedBottomValueKey"
            :inputted-upper-value-commit="field.inputtedUpperValueCommit"
            :inputted-upper-value-key="field.inputtedUpperValueKey"
          ></text-field>
        </div>
      </div>
      <set-initial-state-button class="mt-2"></set-initial-state-button>
    </div>
    <div class="d-flex flex-column ml-auto mr-10">
      <count-pie-chart
        v-for="chart in countCharts"
        :key="chart.labelKey"
        :class="{ 'mt-6': chart.marginTop }"
        :color="RGBColor"
        :count-key="chart.countKey"
        :label-key="chart.labelKey"
        :total-count-key="chart.totalCountKey"
        :view-type="viewType"
      ></count-pie-chart>
    </div>
  </div>
</template>

<script>
import CheckBoxField from "~/components/filters/CheckBoxField"
import ChipField from "~/components/filters/ChipField"
import CountPieChart from "~/components/filters/CountPieChart"
import SetInitialStateButton from "~/components/filters/SetInitialStateButton"
import TextField from "~/components/filters/TextField"

export default {
  components: {
    CheckBoxField,
    ChipField,
    CountPieChart,
    SetInitialStateButton,
    TextField
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
    }
  },
  data() {
    return {
      fields: [
        {
          label: "Project",
          type: "check",
          contentsKey: "projects",
          selectedContentsCommit: "filter/setProjects",
          selectedContentsKey: "projects"
        },
        {
          boxLabel: "is",
          contentsKey: "patientIDs",
          fieldWidth: "660px",
          label: "Patient ID",
          selectedContentsCommit: "filter/setPatientIDs",
          selectedContentsKey: "patientIDs",
          type: "chip"
        },
        {
          boxLabel: "is",
          contentsKey: "projectPatientIDs",
          fieldWidth: "660px",
          label: "Project Patient ID",
          selectedContentsCommit: "filter/setProjectPatientIDs",
          selectedContentsKey: "projectPatientIDs",
          type: "chip"
        },
        {
          contentsKey: "sexes",
          label: "Sex",
          selectedContentsCommit: "filter/setSexes",
          selectedContentsKey: "sexes",
          type: "check"
        },
        {
          boxWidth: "80px",
          fieldType: "number",
          inputtedBottomValueCommit: "filter/setBottomAge",
          inputtedBottomValueKey: "bottomAge",
          inputtedUpperValueCommit: "filter/setUpperAge",
          inputtedUpperValueKey: "upperAge",
          label: "Age",
          type: "text"
        },
        {
          contentsKey: "diseases",
          label: "Disease",
          selectedContentsCommit: "filter/setDiseases",
          selectedContentsKey: "diseases",
          type: "check"
        },
        {
          boxLabel: "is",
          contentsKey: "sampleIDs",
          fieldWidth: "660px",
          label: "Sample ID",
          selectedContentsCommit: "filter/setSampleIDs",
          selectedContentsKey: "sampleIDs",
          type: "chip"
        },
        {
          boxWidth: "200px",
          fieldType: "date",
          inputtedBottomValueCommit: "filter/setBottomSamplingDate",
          inputtedBottomValueKey: "bottomSamplingDate",
          inputtedUpperValueCommit: "filter/setUpperSamplingDate",
          inputtedUpperValueKey: "upperSamplingDate",
          label: "Sampling Date",
          type: "text"
        },
        {
          boxLabel: "must have",
          contentsKey: "dataTypes",
          fieldWidth: "660px",
          label: "Data Type",
          selectedContentsCommit: "filter/setDataTypes",
          selectedContentsKey: "dataTypes",
          type: "chip"
        }
      ],
      countCharts: [
        {
          countKey: "sampleCount",
          labelKey: "sampleID",
          marginTop: false,
          totalCountKey: "totalSampleIDCount"
        },
        {
          countKey: "patientCount",
          labelKey: "patientID",
          marginTop: true,
          totalCountKey: "totalPatientIDCount"
        }
      ]
    }
  },
  computed: {
    RGBColor() {
      return this.color === "primary"
        ? "rgba(30, 136, 229, 1)"
        : "rgba(216, 27, 96, 1)"
    }
  }
}
</script>
