<template>
  <v-app>
    <v-navigation-drawer class="grey darken-3" fixed clipped app>
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
          <v-list-item-content>
            <v-list-item-title class="grey--text text--lighten-4">
              Top Music Overview
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="grey--text text--lighten-4">
              Recent Music Overview
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="grey lighten-3">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Default',
  computed: {
    ...mapState(['user']),
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style>
html {
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
}

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
</style>
