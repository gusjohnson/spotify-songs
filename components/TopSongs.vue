<template>
  <v-card class="card grey darken-4 rounded-lg">
    <v-card-title class="grey--text text--lighten-4">
      Top Tracks
    </v-card-title>
    <v-simple-table class="table py-3 grey lighten-5" dense>
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
            class="song-row"
            @click="$emit('songClicked', item)"
          >
            <td>{{ index + 1 }}</td>
            <td><b>{{ item.name }}</b></td>
            <td>{{ item.artists[0].name }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
export default {
  name: 'TopSongs',
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
.card {
  width: 45%;
  /* max-height: 100%;
  height: 100%; */
}

.table {
  max-height: 100%;
  overflow: auto;
}

.song-row {
  cursor: pointer;
}
</style>
