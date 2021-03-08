<template>
  <v-card class="table grey lighten-5 rounded-xl">
    <v-card-title>
      Top Artists
    </v-card-title>
    <v-simple-table class="py-3 grey lighten-5" dense>
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
.table {
  width: 45%;
}
</style>
