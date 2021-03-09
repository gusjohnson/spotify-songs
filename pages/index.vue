<template>
  <div class="container">
    <h2 class="align-self-start ml-2 pt-3 pb-5">
      Top Music Overview
    </h2>
    <div v-if="!loggedIn" class="links">
      <h2>Please authenticate with Spotify to see your song info:</h2>
    </div>
    <div v-if="!loggedIn">
      <button @click="authenticate">
        Login to Spotify
      </button>
    </div>
    <div v-else class="content">
      <div class="tops">
        <TopSongs class="ml-10 mr-5" :songs="topSongs" />
        <TopArtists class="ml-5 mr-10" :artists="topArtists" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TopSongs from '~/components/TopSongs'
import TopArtists from '~/components/TopArtists.vue'

export default {
  components: {
    TopSongs,
    TopArtists
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
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async authenticate () {
      const redirectUrl = await this.$axios.get('/api/login')
      window.location.href = redirectUrl.data
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

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
  margin-bottom: 50px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding: 15px;

}
</style>
