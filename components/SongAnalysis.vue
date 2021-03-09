<template>
  <div class="grey lighten-3 rounded-lg">
    <bar-chart
      v-if="!isLoading"
      class="pa-5"
      :data="barChartData"
      :options="barChartOptions"
      :height="400"
      :width="600"
    />
  </div>
</template>

<script>
import BarChart from '~/components/BarChart.vue'
export default {
  name: 'SongAnalysis',
  components: {
    BarChart
  },
  props: {
    song: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      barChartData: {
        labels: [
          'Acousticness',
          'Danceability',
          'Energy',
          'Instrumentalness',
          'Liveness',
          'Speechiness',
          'Valence'
        ],
        datasets: []
      },
      barChartOptions: {
        responsive: true,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: `${this.song.artists[0].name} - ${this.song.name}`,
          fontSize: 24,
          fontColor: '#212121'
        },
        tooltips: {
          backgroundColor: '#17BF62'
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 100
              },
              gridLines: {
                display: true
              }
            }
          ]
        }
      },
      isLoading: true
    }
  },
  // computed: {
  //   artist() {
  //     return this.song.artists[0].name
  //   }
  // },
  async mounted() {
    try {
      const audioAnalysis = (await this.$axios.get(`/api/spotify/audio-features/${this.song.id}`)).data
      let dataPoints = [audioAnalysis.acousticness, audioAnalysis.danceability, audioAnalysis.energy,
        audioAnalysis.instrumentalness, audioAnalysis.liveness, audioAnalysis.speechiness, audioAnalysis.valence]
      dataPoints = dataPoints.map(val => val * 100)
      const dataSet = {
        label: this.song.name,
        data: dataPoints,
        backgroundColor: '#1B5E20'
      }
      this.barChartData.datasets.push(dataSet)
    } catch (e) {
      console.log('Error')
    }

    this.isLoading = false
  }
}
</script>
