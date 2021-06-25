<template>
  <div>
      <button @click="logout">Logout</button>
      <h2>Available users</h2>
      <ul>
        <li v-for="otherUser, id in users" :key="id" :style="userColor(otherUser)" @click="requestMatch(otherUser)">
          <span>{{otherUser.username}}</span>
          <span v-if="otherUser.matchRequest == user.username">{{otherUser.username}} wants to play with you</span>
          <span v-else>No match request</span>
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    requestMatch(user) {
      this.$store.dispatch('requestMatch', user)
    },
    userColor(otherUser) {
      if (otherUser.matchRequest == this.user.username) {
        return {
          backgroundColor: 'rgba(200,50,50,0.4)'
        }
      } else if (this.$store.state.matchRequest && (this.$store.state.matchRequest.username == otherUser.username)) {
        return {
          backgroundColor: 'rgba(50,200,50,0.4)'
        }
      }
    },
    logout() {
      this.$store.dispatch('logout')
    }
  },
  computed: {
    users() {
      return this.$store.state.users
        .filter(user => user.username !== this.user.username)
        .filter(user => user.inMatch == false)
    },
    user () {
      return this.$store.state.user
    }
  }
}
</script>

<style scoped>
span {
  margin: 10px;
}

li:hover {
  background-color: rgba(200,50,50,0.8);
}
</style>