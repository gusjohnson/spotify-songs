<template>
  <div class="container">
    <v-overlay v-if="selectedSong">
      <SongAnalysis v-click-outside="hideGraph" :song="selectedSong" />
    </v-overlay>
    <h4 class="grey--text text--lighten-4 pt-5 pb-10">
      Below are lists of your top 20 listened-to tracks and artists on Spotify.
      Click a track or artist row to see cool stuff!
    </h4>
    <div v-if="!loggedIn" class="links">
      <h2>Please authenticate with Spotify to see your song info:</h2>
    </div>
    <div v-if="!loggedIn">
      <button @click="authenticate">
        Login to Spotify
      </button>
    </div>
    <div v-else class="content pb-15">
      <div class="tops">
        <TopSongs class="ml-10 mr-5" :songs="topSongs" @songClicked="showSongGraph" />
        <TopArtists class="ml-5 mr-10" :artists="topArtists" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TopSongs from '~/components/TopSongs'
import TopArtists from '~/components/TopArtists.vue'
import SongAnalysis from '~/components/SongAnalysis'

export default {
  components: {
    TopSongs,
    TopArtists,
    SongAnalysis
  },
  async asyncData({ $axios, store, req }) {
    let loggedIn = false
    let topSongs = []
    let topArtists = []

    try {
      const user = await $axios.get('/api/spotify/me')
      if (user) {
        store.commit('set_user', user.data)
        loggedIn = true

        topSongs = (await $axios.get('/api/spotify/me/top/tracks?time_range=long_term')).data.items
        topArtists = (await $axios.get('/api/spotify/me/top/artists?time_range=long_term')).data.items
      }
    } catch (e) {
      console.log('Error fetching user account information from Spotify')
    }

    return {
      loggedIn,
      topSongs,
      topArtists
    }
  },
  data () {
    return {
      selectedSong: null
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async authenticate () {
      const redirectUrl = await this.$axios.get('/api/login')
      window.location.href = redirectUrl.data
    },
    showSongGraph(song) {
      this.selectedSong = song
    },
    hideGraph() {
      this.selectedSong = null
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-height: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  padding-top: 20px;
  width: 100%;
}

.content {
  width: 100%;
  display: flex;
}

.tops {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.links {
  padding: 15px;
}
</style>
