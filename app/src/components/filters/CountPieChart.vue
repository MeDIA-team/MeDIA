<template>
  <div class="d-flex flex-column" :style="{ minWidth: '250px' }">
    <div class="d-inline-block" :style="{ textAlign: 'center' }">
      <span class="info--text font-weight-medium subtitle" v-text="label" />
    </div>
    <pie-chart
      :chart-data="chartData"
      :height="200"
      :options="chartOptions"
      :style="{ margin: '20px auto 0' }"
      :width="200"
    />
    <div class="d-inline-block mr-6 mt-2" :style="{ textAlign: 'right' }">
      <span
        class="info--text font-weight-medium subtitle"
        v-text="`${filtered} / ${total}`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ChartOptions, ChartData } from 'chart.js'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'
import PieChart from '@/components/filters/PieChart.vue'

interface Data {
  chartOptions: ChartOptions
}

interface Computed {
  viewType: string
  color: string
  label: string
  filtered: number
  total: number
  chartData: ChartData
}

interface Props {
  chartType: string
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Record<string, never>,
  Computed,
  Props
> = {
  components: {
    PieChart,
  },

  props: {
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
    viewType() {
      return this.$route.path.split('/')[1]
    },

    color() {
      return this.viewType === 'sample'
        ? 'rgba(30, 136, 229, 1)'
        : 'rgba(216, 27, 96, 1)'
    },

    label() {
      return `Number of displayed ${this.chartType}s`
    },

    filtered() {
      return this.$store.state.filter[this.viewType].counts[this.chartType]
        .filtered
    },

    total() {
      return this.$store.state.filter[this.viewType].counts[this.chartType]
        .total
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
