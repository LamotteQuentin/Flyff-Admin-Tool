<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              id: 'CPU',
              type: 'linear',
              position: 'left',
              ticks: {
                max: 100,
                min: 0,
                callback: value => {
                  return this.$options.filters.percent(value, 2, 1);
                }
              }
            },
            {
              id: 'RAM',
              type: 'linear',
              position: 'right',
              ticks: {
                callback: value => {
                  return this.$options.filters.bytes(value);
                }
              }
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
