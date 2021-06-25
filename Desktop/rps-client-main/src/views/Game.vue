<template>
    <v-card style="width: 60%" class="mx-auto">
        <div v-if="screen == 'idle'">
            <idle />
        </div>
        <div v-else-if="screen == 'match'">
            <match />
        </div>
        <div v-else-if="screen == 'result'">
            <result/>
        </div>
    </v-card>
</template>

<script>
import Match from '@/components/Match'
import Idle from '@/components/Idle'
import Result from '@/components/Result'
export default {
  name: 'Game',
  components: {
      Match,
      Idle,
      Result
  },
  computed: {
      screen () {
          return this.$store.state.screen
      }
  }
}
</script>

<style scoped>
</style>