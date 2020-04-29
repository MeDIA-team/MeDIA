<template>
  <div class="d-flex flex-column" style="min-width: 250px;">
    <div class="d-inline-block" style="text-align: center;">
      <span class="info--text font-weight-medium subtitle">
        {{ label }}
      </span>
    </div>
    <pie-chart
      :chart-data="chartData"
      :height="200"
      :options="chartOptions"
      :width="200"
      style="margin: 20px auto 0;"
    ></pie-chart>
    <div class="d-inline-block mr-6 mt-2" style="text-align: right;">
      <span class="info--text font-weight-medium subtitle">
        {{ count }} / {{ totalCount }}
      </span>
    </div>
  </div>
</template>

<script>
import PieChart from "~/components/filters/PieChart.vue"

export default {
  components: { PieChart },
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
    },
    countKey: {
      type: String,
      default: "",
      require: true
    },
    totalCountKey: {
      type: String,
      default: "",
      require: true
    },
    labelKey: {
      type: String,
      default: "",
      require: true
    }
  },
  data() {
    return {
      chartOptions: {
        hover: false,
        legend: { display: false },
        responsive: false,
        tooltips: { enabled: false },
        maintainAspectRatio: false
      }
    }
  },
  computed: {
    chartData() {
      return {
        datasets: [
          {
            data: [
              this.$store.state[`${this.viewType}Entry`][this.countKey],
              this.$store.state.init[this.totalCountKey] -
                this.$store.state[`${this.viewType}Entry`][this.countKey]
            ],
            backgroundColor: [this.color, "rgba(255, 255, 255, 0)"],
            borderColor: this.color,
            borderWidth: 0.6
          }
        ]
      }
    },
    count() {
      return this.$store.state[`${this.viewType}Entry`][this.countKey]
    },
    totalCount() {
      return this.$store.state.init[this.totalCountKey]
    },
    label() {
      return this.$store.state.const.chartLabel[this.labelKey]
    }
  }
}
</script>
