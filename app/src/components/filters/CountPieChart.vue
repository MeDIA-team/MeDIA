<template>
  <div class="d-flex flex-column" style="min-width: 250px">
    <div class="d-inline-block" style="text-align: center">
      <span class="info--text font-weight-medium subtitle" v-text="label" />
    </div>
    <pie-chart
      :chart-data="chartData"
      :height="200"
      :options="chartOptions"
      :width="200"
      style="margin: 20px auto 0"
    />
    <div class="d-inline-block mr-6 mt-2" style="text-align: right">
      <span
        class="info--text font-weight-medium subtitle"
        v-text="`${filtered} / ${totalCount}`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ChartOptions, ChartData } from 'chart.js'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { TypedStore } from '@/store'
import PieChart from '@/components/filters/PieChart.vue'
import Vue from 'vue'

type Data = {
  chartOptions: ChartOptions
}

type Methods = Record<string, never>

type Computed = {
  color: string
  label: string
  filtered: number
  totalCount: number
  chartData: ChartData
}

type Props = {
  viewType: string
  chartType: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  components: { PieChart },

  props: {
    viewType: {
      type: String,
      required: true,
      validator: (val: string) => {
        return ['sample', 'patient'].includes(val)
      },
    },
    chartType: {
      type: String,
      required: true,
      validator: (val: string) => {
        return ['sample', 'patient'].includes(val)
      },
    },
  },

  data() {
    return {
      chartOptions: {
        hover: { intersect: false },
        legend: { display: false },
        maintainAspectRatio: false,
        responsive: false,
        tooltips: { enabled: false },
      },
    }
  },

  computed: {
    color() {
      return this.viewType === 'sample'
        ? 'rgba(30, 136, 229, 1)'
        : 'rgba(216, 27, 96, 1)'
    },
    label() {
      return `Number of displayed ${this.chartType}s`
    },
    filtered() {
      return (this.$store as TypedStore).state.filter[
        this.viewType as 'sample' | 'patient'
      ].count[this.chartType as 'sample' | 'patient'].filtered
    },
    totalCount() {
      return (this.$store as TypedStore).state.filter[
        this.viewType as 'sample' | 'patient'
      ].count[this.chartType as 'sample' | 'patient'].total
    },
    chartData() {
      return {
        datasets: [
          {
            data: [this.filtered, this.total - this.filtered],
            backgroundColor: [this.color, 'rgba(255, 255, 255, 0)'],
            borderColor: this.color,
            borderWidth: 0.6,
          },
        ],
      }
    },
  },
}

export default Vue.extend(options)
</script>
