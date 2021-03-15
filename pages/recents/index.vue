<template>
  <div class="container">
    <v-overlay v-if="selectedSong">
      <SongAnalysis v-click-outside="hideSongGraph" :song="selectedSong" />
    </v-overlay>
    <v-overlay v-if="selectedArtist">
      <ArtistAnalysis v-click-outside="hideArtistGraph" :artist="selectedArtist" />
    </v-overlay>
    <!-- <h4 class="grey--text text--lighten-4 pt-5 pb-10">
      Below are lists of your top 20 listened-to tracks and artists on Spotify.
      Click a track or artist row to see cool stuff!
    </h4> -->
    <div class="content pt-5 pb-15">
      <div class="tops">
        <SongList class="ml-10 mr-5" :songs="topSongs" title="Recent Tracks" @songClicked="showSongGraph" />
        <!-- <TopArtists class="ml-5 mr-10" :artists="topArtists" @artistClicked="showArtistGraph" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SongList from '~/components/SongList'
// import TopArtists from '~/components/TopArtists.vue'
import SongAnalysis from '~/components/SongAnalysis'
import ArtistAnalysis from '~/components/ArtistAnalysis'

export default {
  components: {
    SongList,
    // TopArtists,
    SongAnalysis,
    ArtistAnalysis
  },
  async asyncData({ $axios, store, req }) {
    let loggedIn = false
    let topSongs = []
    // let topArtists = []

    try {
      const user = await $axios.get('/api/spotify/me')
      if (user) {
        store.commit('set_user', user.data)
        loggedIn = true

        topSongs = (await $axios.get('/api/spotify/me/player/recently-played?limit=50')).data.items
        topSongs = topSongs.map(t => t.track)
      }
    } catch (e) {
      console.log('Error fetching user account information from Spotify')
    }

    return {
      loggedIn,
      topSongs
      // topArtists
    }
  },
  data () {
    return {
      selectedSong: null,
      selectedArtist: null
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    showSongGraph(song) {
      this.selectedSong = song
    },
    hideSongGraph() {
      this.selectedSong = null
    },
    showArtistGraph(artist) {
      this.selectedArtist = artist
    },
    hideArtistGraph() {
      this.selectedArtist = null
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
  height: 100%;
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
  height: 100%;
  display: flex;
}

.tops {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  /* height: 50%;
  max-height: 50%; */
}

.links {
  padding: 15px;
}
</style>
