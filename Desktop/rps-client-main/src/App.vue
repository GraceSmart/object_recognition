<template>
  <v-app>
    <v-app-bar
      app
      dark
    >
      <div>
        <span class="font-weight-black">ROCK PAPER SCISSORS</span>
      </div>
      <v-spacer></v-spacer>
      <v-chip
        class="ma-2"
        outlined
        pill
        v-if="loggedIn"
      >
        Logged in as {{username}}
        <button v-if="loggedIn" @click="logout">
          <v-icon right>mdi-logout</v-icon>
        </button>
      </v-chip>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
    <v-footer padless>
      <v-col
        class="text-center"
        cols="12"
      >
        2021 — &copy;&nbsp;<strong>CDS</strong>
      </v-col>
    </v-footer>    
  </v-app>  
</template>

<script>
export default {
  name: 'App',
  data: () => ({
  }),
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    username() {
      return this.$store.getters.username
    }
  }
};
</script>