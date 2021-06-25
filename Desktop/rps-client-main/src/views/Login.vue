<template>
  <v-card style="width: 60%" class="mx-auto">
    <v-card-title>Enter your username</v-card-title>
    <v-card-text>
      <v-text-field 
        label="Username"
        prepend-icon="mdi-account-circle"
        v-model.trim="username"
        @keyup.enter="enterGame"          
      ></v-text-field>
      <v-alert border="top"
        color="red lighten-2"
        dark
        v-model="userExists"
      >
        Username already taken
      </v-alert>
    </v-card-text>
    <v-card-title>Choose an interaction mode</v-card-title>
    <v-card-text>
      <v-radio-group v-model="mode">
        <v-radio value="buttons" label="Buttons" />
        <v-radio value="gesture" label="Gestures"/>
        <v-radio value="speech" label="Speech"/>
      </v-radio-group>
    </v-card-text>
    <v-card-actions>
      <v-btn color="success" @click="enterGame">Enter game</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Login',
  data() {
      return {
          username: ''
      }
  },
  methods: {
    enterGame () {
      if (this.username != '') {
        this.$store.dispatch('login', this.username)
      }
    }
  },
  computed: {
    userExists() {
      return this.$store.state.invalidUser
    },
    mode: {
      get() {
        return this.$store.state.mode
      },
      set(value) {
        this.$store.dispatch('setMode', value)
      }
    }
  }
}
</script>

<style scoped>
</style>