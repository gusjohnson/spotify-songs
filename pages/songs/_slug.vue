<template>
  <SongAnalysis :song="song" />
</template>

<script>
import SongAnalysis from '~/components/SongAnalysis.vue'

export default {
  components: {
    SongAnalysis
  },
  async asyncData({ $axios, store, params }) {
    let song
    try {
      song = (await $axios.get(`/api/spotify/tracks/${params.slug}`)).data
    } catch (e) {
      console.log('Error fetching user account information from Spotify', e)
    }

    return {
      song
    }
  }
}
</script>
