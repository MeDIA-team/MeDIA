<script lang="ts">
import { ChartOptions } from 'chart.js'
import { Pie, mixins } from 'vue-chartjs'
import { ReactivePropMixin } from 'vue-chartjs/types/mixins'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'

type Data = Record<string, never>

type Methods = Record<string, never>

type Computed = Record<string, never>

type Props = {
  options: ChartOptions
}

const options: ThisTypedComponentOptionsWithRecordProps<
  Vue | Pie,
  Data,
  Methods,
  Computed,
  Props | ReactivePropMixin
> = {
  extends: Pie,
  mixins: [mixins.reactiveProp],
  props: {
    options: {
      type: Object,
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
}

export default Vue.extend(options)
</script>
