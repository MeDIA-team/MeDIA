<template>
  <div class="d-flex">
    <div class="d-flex flex-column">
      <div v-for="field in fields" :key="field.label" class="d-flex">
        <div class="d-flex align-center" style="min-width: 140px">
          <span class="info--text font-weight-medium" v-text="field.label" />
        </div>
        <div v-if="field.type === 'check'">
          <check-box-field
            :view-type="viewType"
            :content-key="field.contentKey"
          />
        </div>
        <div v-else-if="field.type === 'chip'" class="my-2">
          <chip-field
            :box-label="field.boxLabel"
            :content-key="field.contentKey"
            :field-width="field.fieldWidth"
            :view-type="viewType"
          />
        </div>
        <div v-else-if="field.type === 'text'">
          <text-field
            :box-width="field.boxWidth"
            :view-type="viewType"
            :content-key="field.contentKey"
            :text-field-type="field.textFieldType"
          />
        </div>
      </div>
      <reset-filter-button :view-type="viewType" class="mt-2" />
    </div>
    <div class="d-flex flex-column ml-auto mr-10">
      <count-pie-chart
        v-for="(chart, ind) in ['sample', 'patient']"
        :key="ind"
        :chart-type="chart"
        :class="{ 'mt-6': ind === 1 }"
        :view-type="viewType"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import CheckBoxField from '@/components/filters/CheckBoxField.vue'
import ChipField from '@/components/filters/ChipField.vue'
import CountPieChart from '@/components/filters/CountPieChart.vue'
import ResetFilterButton from '@/components/filters/ResetFilterButton.vue'
import TextField from '@/components/filters/TextField.vue'
import Vue from 'vue'

type FieldType = {
  label: string
  type: 'check' | 'chip' | 'text'
  contentKey: string
}

type CkeckFieldType = FieldType

type ChipFieldType = FieldType & {
  boxLabel: 'is' | 'must have'
  boxWidth: string
}

type TextFieldType = FieldType & {
  boxWidth: string
  textFieldType: string
}

type Data = {
  fields: Array<CkeckFieldType | ChipFieldType | TextFieldType>
}

type Methods = Record<string, never>

type Computed = Record<string, never>

type Props = {
  viewType: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  components: {
    CheckBoxField,
    ChipField,
    CountPieChart,
    ResetFilterButton,
    TextField,
  },

  props: {
    viewType: {
      type: String,
      required: true,
      validator: (val: string) => {
        return ['sample', 'patient'].includes(val)
      },
    },
  },

  data() {
    return {
      fields: [
        {
          contentKey: 'projects',
          label: 'Project',
          type: 'check',
        },
        {
          boxLabel: 'is',
          fieldWidth: '660px',
          contentKey: 'patientIDs',
          label: 'Patient ID',
          type: 'chip',
        },
        {
          boxLabel: 'is',
          fieldWidth: '660px',
          contentKey: 'projectPatientIDs',
          label: 'Project Patient ID',
          type: 'chip',
        },
        {
          contentKey: 'sexes',
          label: 'Sex',
          type: 'check',
        },
        {
          boxWidth: '80px',
          contentKey: 'age',
          label: 'Age',
          textFieldType: 'number',
          type: 'text',
        },
        {
          contentKey: 'diseases',
          label: 'Disease',
          type: 'check',
        },
        {
          boxLabel: 'is',
          fieldWidth: '660px',
          contentKey: 'sampleIDs',
          label: 'Sample ID',
          type: 'chip',
        },
        {
          boxWidth: '200px',
          contentKey: 'samplingDate',
          label: 'Sampling Date',
          textFieldType: 'date',
          type: 'text',
        },
        {
          boxLabel: 'must have',
          fieldWidth: '660px',
          contentKey: 'dataTypes',
          label: 'Data Type',
          type: 'chip',
        },
      ],
    }
  },
}

export default Vue.extend(options)
</script>
