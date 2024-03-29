<template>
  <div class="d-flex">
    <div class="d-flex flex-column">
      <div v-for="field in fields" :key="field.id" class="d-flex">
        <div class="d-flex align-center" :style="{ minWidth: '140px' }">
          <span class="info--text font-weight-medium" v-text="field.label" />
        </div>
        <div v-if="field.form.type === 'checkbox'">
          <checkbox-field :id="field.id" />
        </div>
        <div v-else-if="field.form.type === 'chip'" class="my-2">
          <chip-field :id="field.id" />
        </div>
        <div v-else-if="field.form.type === 'text'">
          <text-field :id="field.id" />
        </div>
      </div>
      <reset-filter-button class="mt-2" />
    </div>
    <div class="d-flex flex-column ml-auto mr-10">
      <count-pie-chart
        v-for="(chart, ind) in ['sample', 'patient']"
        :key="ind"
        :chart-type="chart"
        :class="{ 'mt-6': ind === 1 }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import CheckboxField from '@/components/filters/CheckboxField.vue'
import ChipField from '@/components/filters/ChipField.vue'
import CountPieChart from '@/components/filters/CountPieChart.vue'
import ResetFilterButton from '@/components/filters/ResetFilterButton.vue'
import TextField from '@/components/filters/TextField.vue'
import Vue from 'vue'

interface Computed {
  viewType: string
  fields: Array<CheckboxField | ChipField | TextField>
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Record<string, never>,
  Record<string, never>,
  Computed,
  Record<string, never>
> = {
  components: {
    CheckboxField,
    ChipField,
    CountPieChart,
    ResetFilterButton,
    TextField,
  },

  computed: {
    viewType() {
      return this.$route.path.split('/')[1]
    },

    fields() {
      return this.$dataConfig.filter.fields
    },
  },
}

export default Vue.extend(options)
</script>
