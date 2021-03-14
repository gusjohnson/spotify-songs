<template>
  <v-card class="card grey darken-4 rounded-lg">
    <v-card-title class="grey--text text--lighten-4">
      Top Artists
    </v-card-title>
    <v-simple-table class="table py-3 grey lighten-5" dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center">
              #
            </th>
            <th class="text-center">
              Artist
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in artists"
            :key="item.id"
            class="artist-row"
            @click="$emit('artistClicked', item)"
          >
            <td>{{ index + 1 }}</td>
            <td><b>{{ item.name }}</b></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
export default {
  name: 'TopArtists',
  props: {
    artists: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.card {
  width: 45%;
  /* max-height: 25%;
  height: 25%; */
}

.table {
  max-height: 100%;
  overflow: auto;
}

.artist-row {
  cursor: pointer;
}
</style>
