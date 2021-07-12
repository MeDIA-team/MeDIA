<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Pie, mixins } from 'vue-chartjs'
import Vue from 'vue'

export default Vue.extend({
  extends: Pie,
  mixins: [mixins.reactiveProp],
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    // @ts-ignore
    this.renderChart(this.chartData, this.options)
  },
})
</script>
