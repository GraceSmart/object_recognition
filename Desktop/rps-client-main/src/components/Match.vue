<template>
  <v-container>
    <v-card-text>
      <div class="text-h1 text-center"
        v-if="counter != 0"
      >
        {{ counter }}
      </div>
      <div v-if="counter == 0 && !turn" class="d-flex pa-2 justify-center">
          <v-card-actions v-if="mode == 'buttons'">
            <v-btn @click="makeTurn('rock')">Rock</v-btn>
            <v-btn @click="makeTurn('paper')">Paper</v-btn>
            <v-btn @click="makeTurn('scissors')">Scissors</v-btn>
          </v-card-actions>
          <gesture v-if="mode == 'gesture'" @gesture="makeTurn"/>
          <speech v-if="mode == 'speech'" @word="makeTurn"/>
      </div>
      <div v-if="turn">
        <v-card-title>Your choice: {{ turn }}</v-card-title>
        <v-card-subtitle>Waiting for opponent...</v-card-subtitle>
      </div>
    </v-card-text>
  </v-container>
</template>

<script>
import Gesture from './Gesture'
import Speech from './Speech'
export default {
  components: {
    Gesture,
    Speech
  },
  data () {
    return {
      counter: 3
    }
  },
  mounted () {
    let interval = setInterval(() => {
      this.counter--
      if (this.counter == 0) {
        clearInterval(interval)
      }
    }, 1000)
  },
  methods: {
    makeTurn(turn) {
      this.$store.dispatch('makeTurn', {turn: turn})
    }
  },
  computed: {
    turn() {
      return this.$store.state.turn
    },
    mode() {
      return this.$store.state.mode
    }
  }
}
</script>