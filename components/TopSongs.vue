<template>
  <v-card class="table grey lighten-5 rounded-xl">
    <v-card-title>
      Top Tracks
    </v-card-title>
    <v-simple-table class="py-3 grey lighten-5" dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center">
              #
            </th>
            <th class="text-center">
              Track
            </th>
            <th class="text-center">
              Artist
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in songs"
            :key="item.id"
            @click="$router.push(`/songs/${item.id}`)"
          >
            <td>{{ index + 1 }}</td>
            <td><b>{{ item.name }}</b></td>
            <td>{{ item.artists[0].name }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- <SongAnalysis v-if="selectedSong" :song="selectedSong" /> -->
  </v-card>
</template>

<script>
// import SongAnalysis from '~/components/SongAnalysis'

export default {
  name: 'TopSongs',
  components: {
    // SongAnalysis
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectedSong: null
    }
  }
}
</script>

<style scoped>
.table {
  width: 45%;
}
</style>
