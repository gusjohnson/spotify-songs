<template>
  <div>
    <v-progress-circular v-if="isLoading" indeterminate />
    <div v-else class="grey lighten-3 rounded-lg song-graph-container">
      <div v-if="!isLoading" class="d-flex align-start flex-column grey--text text--darken-4 pt-3">
        <div class="d-flex align-center">
          <img v-if="artistPhoto" :src="artistPhoto" height="80" width="80" class="rounded-circle mx-4">
          <div class="d-flex flex-column align-start">
            <div class="text-caption mb-n2">
              Song Profile
            </div>
            <h2>
              {{ song.name }}
            </h2>
            <div class="mt-n2 text-sm">
              <i>{{ artistName }}</i>
            </div>
          </div>
        </div>
      </div>
      <bar-chart
        v-if="!isLoading"
        class="pa-10"
        :data="barChartData"
        :options="barChartOptions"
        :height="400"
        :width="600"
      />
      <div v-if="!isLoading" class="grey--text text--darken-3 text-container">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              What do these values mean?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ul class="no-bullets px-4">
                <li class="py-2">
                  <b>Acousticness</b> - a confidence measure of whether the track is acoustic.
                </li>
                <li class="py-2">
                  <b>Danceability</b> - describes how suitable a track is for
                  dancing based on a combination of musical elements including tempo,
                  rhythm stability, beat strength, and overall regularity. A value of 0
                  is least danceable and 100 is most danceable.
                </li>
                <li class="py-2">
                  <b>Energy</b> - a measure from 0 to 100 that represents a perceptual measure
                  of intensity and activity. Typically, energetic tracks feel fast, loud, and
                  noisy. For example, death metal has high energy, while a Bach prelude scores
                  low on the scale. Perceptual features contributing to this attribute include
                  dynamic range, perceived loudness, timbre, onset rate, and general entropy.
                </li>
                <li class="py-2">
                  <b>Instrumentalness</b> - predicts whether a track contains no vocals.
                  “Ooh” and “aah” sounds are treated as instrumental in this context. Rap
                  or spoken word tracks are clearly “vocal”. The closer the instrumentalness
                  value is to 100, the greater likelihood the track contains no vocal content.
                  Values above 50 are intended to represent instrumental tracks, but
                  confidence is higher as the value approaches 100.
                </li>
                <li class="py-2">
                  <b>Liveness</b> - detects the presence of an audience in the recording.
                  Higher liveness values represent an increased probability that the track
                  was performed live. A value above 80 provides strong likelihood that the track is live.
                </li>
                <li class="py-2">
                  <b>Speechiness</b> - detects the presence of spoken words in a track. The
                  more exclusively speech-like the recording (e.g. talk show, audio book, poetry),
                  the closer to 100 the attribute value. Values above 0.66 describe tracks
                  that are probably made entirely of spoken words. Values between 33 and 66
                  describe tracks that may contain both music and speech, either in sections
                  or layered, including such cases as rap music. Values below 0.33 most likely
                  represent music and other non-speech-like tracks.
                </li>
                <li class="py-2">
                  <b>Valence</b> - a measure from 0 to 100 describing the musical positiveness
                  conveyed by a track. Tracks with high valence sound more positive (e.g. happy,
                  cheerful, euphoric), while tracks with low valence sound more negative (e.g.
                  sad, depressed, angry).
                </li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
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
      isLoading: true,
      showDefinitions: false,
      artist: null
    }
  },
  computed: {
    artistName() {
      return this.artist?.name || this.song.artists[0].name
    },
    artistPhoto() {
      return this.artist?.images[0]?.url
    }
  },
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

      this.artist = (await this.$axios.get(`/api/spotify/artists/${this.song.artists[0].id}`)).data
    } catch (e) {
      console.log('Error')
    }

    this.isLoading = false
  }
}
</script>

<style scoped>
.song-graph-container {
  max-width: 700px;
  max-height: 600px;
  overflow: auto;
}

.text-container {
  max-width: 100%;
  width: 100%;
}

ul.no-bullets {
  list-style-type: none;
  text-align: left;
}
</style>
