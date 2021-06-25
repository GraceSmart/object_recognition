<template>
  <div class="about">
    <h1>Result</h1>
    <div v-if="result.winner">{{result.winner.username}} wins!</div>
    <div v-if="result.winner == null">Draw!</div>
    <table>
      <tr v-for="(user, id) in result.players" :key="id">
        <td>{{user.username}}</td><td>{{user.turn}}</td>
      </tr>
    </table>
    <button @click="newMatch">Start a new match</button>
  </div>
</template>

<script>
export default {
  methods: {
    newMatch() {
      this.$store.dispatch('newMatch')
    }
  },
  computed: {
    result () {
      return this.$store.state.result
    }
  }
}
</script>