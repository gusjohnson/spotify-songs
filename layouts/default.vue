<template>
  <v-app>
    <v-app-bar
      color="green darken-3"
      app
      flat
      dense
    >
      <v-app-bar-nav-icon class="grey--text text--lighten-4" @click.stop="drawer = !drawer" />
      <v-app-bar-title class="grey--text text--lighten-4">
        <b>Spotify Profiler</b>
      </v-app-bar-title>
    </v-app-bar>
    <v-expand-x-transition>
      <v-navigation-drawer
        v-model="drawer"
        class="grey darken-4 elevation-10"
        temporary
        app
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="isLoggedIn" class="d-flex align-center justify-start grey--text text--lighten-4">
                <img class="rounded-circle login-photo" :src="user.images[0].url">
                <h3>{{ user.display_name }}</h3>
              </span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list dense nav>
          <v-list-item link>
            <v-list-item-content @click="$router.push('/')">
              <v-list-item-title class="grey--text text--lighten-4">
                Top Music Overview
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="grey--text text--lighten-4" @click="$router.push('/recents')">
                Recent Music Overview
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-expand-x-transition>
    <v-main class="grey darken-4">
      <v-overlay v-if="!isLoggedIn">
        <div>
          <v-btn class="green" rounded @click="authenticate">
            Login with Spotify Account
          </v-btn>
        </div>
      </v-overlay>
      <Nuxt v-else />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Default',
  data() {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['isLoggedIn'])
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
/* html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
} */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
}

.login-photo {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.menu {
  cursor: pointer;
}
</style>
