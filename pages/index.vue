<template>
  <div class="container">
    <div class="header">
      <span v-if="loggedIn" class="user-info">
        <img class="login-photo" :src="user.images[0].url">
        <h2>{{ user.display_name }}</h2>
      </span>
    </div>
    <!-- <div>
      <h1 class="title">
        Spotify Analysis
      </h1>
    </div> -->
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
        <!-- <h2>{{ user.display_name }}</h2>
        <img :src="user.images[0].url"> -->
        <div>
          <h3>TOP SONGS</h3>
          <div v-for="song in topSongs" :key="song.id">
            {{ song.name }}
          </div>
        </div>
        <div>
          <h3>TOP ARTISTS</h3>
          <div v-for="artist in topArtists" :key="artist.id">
            {{ artist.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
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
  margin: 0 auto;
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

.user-info {
  display: flex;
  align-items: center;
}

.login-photo {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  margin-right: 5px;
}

.content {
  width: 100%;
  display: flex;
}

.tops {
  display: flex;
  justify-content: space-evenly;
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
