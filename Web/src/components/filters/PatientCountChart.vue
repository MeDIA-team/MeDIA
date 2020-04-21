<template>
  <div class="d-flex flex-column" style="min-width: 250px;">
    <div class="d-inline-block" style="text-align: center;">
      <span class="grey--text text--darken-3 font-weight-medium subtitle"
        >{{ this.$store.state.const.chartLabel.patientID }}
      </span>
    </div>
    <pie-chart
      :chart-data="chartData"
      :height="200"
      :options="chartOptions"
      :width="200"
      style="margin: 20px auto 0;"
    ></pie-chart>
    <div class="d-inline-block mr-6" style="text-align: right;">
      <span class="grey--text text--darken-3 font-weight-medium subtitle"
        >{{ patientCount }} / {{ totalPatientIDCount }}
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
              this.$store.state.entry.patientCount,
              this.$store.state.init.totalPatientIDCount -
                this.$store.state.entry.patientCount
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
    totalPatientIDCount() {
      return this.$store.state.init.totalPatientIDCount
    },
    patientCount() {
      return this.$store.state.entry.patientCount
    }
  }
}
</script>
