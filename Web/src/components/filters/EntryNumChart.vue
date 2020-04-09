<template>
  <div class="d-flex flex-column" style="min-width: 250px;">
    <div class="d-inline-block" style="text-align: center;">
      <span class="grey--text text--darken-3 font-weight-medium subtitle"
        >Number of displayed entries
      </span>
    </div>
    <pie-chart
      :chart-data="chartData"
      :options="chartOptions"
      :height="200"
      :width="200"
      style="margin: 20px auto 0;"
    ></pie-chart>
    <div class="d-inline-block mr-6" style="text-align: right;">
      <span class="grey--text text--darken-3 font-weight-medium subtitle"
        >{{ entryNum }} / {{ totalEntryNum }}
      </span>
    </div>
  </div>
</template>

<script>
import PieChart from "~/components/filters/PieChart.vue"
export default {
  components: { PieChart },
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
              this.$store.state.entry.entryNum,
              this.$store.state.init.totalEntryNum -
                this.$store.state.entry.entryNum
            ],
            backgroundColor: [
              "rgba(25, 118, 210, 0.8)",
              "rgba(255, 255, 255, 0)"
            ],
            borderColor: "rgba(25, 118, 210, 0.3)"
          }
        ]
      }
    },
    totalEntryNum() {
      return this.$store.state.init.totalEntryNum
    },
    entryNum() {
      return this.$store.state.entry.entryNum
    }
  }
}
</script>
