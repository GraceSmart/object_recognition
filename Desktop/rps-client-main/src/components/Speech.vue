<template>
  <v-card-text>
    <v-select
      :items="audioDevices"
      v-model="audioDevice"
      item-text="label"
      item-value="deviceId"
    />
    <v-simple-table>
      <tbody>
      <tr v-if="topPrediction != null">
        <td>{{ topPrediction.name }}</td>
        <td>{{ topPrediction.score }} %</td>
      </tr>
      <tr v-else>
        <td>Not sure...</td>
      </tr>
      <tr v-for="(prediction, index) in filteredSortedPredictions" v-bind:key="index">
        <td>{{prediction.name}}</td>
        <td>{{prediction.score}} %</td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-card-text>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
import * as speechCommands from '@tensorflow-models/speech-commands'
export default {
  name: 'App',
  data () {
    return {
      isModelReady: false,
      predictions: [],
      audioTrackConstraints: {},
      audioDevices: [],
      audioDevice: ''
    }
  },
  watch: {
    audioDevice: function (deviceId) {
      if (this.recognizer) {
        this.setupRecognizer(deviceId)
      }
    }
  },
  computed: {
    sortedPredictions () {
      const predictions = [...this.predictions]
      predictions.sort((a, b) => {
        return (b.score - a.score)
      })
      return predictions
    },
    topPrediction () {
      if (this.sortedPredictions.length > 0) {
        return this.sortedPredictions[0]
      }
      else {
        return null
      }
    },
    filteredSortedPredictions () {
      const t = this.topPrediction
      return this.sortedPredictions.filter(p => p != t)
    }
  },
  async mounted () {
    tf.setBackend('webgl')
    const enumeratorPromise = navigator.mediaDevices.enumerateDevices()
    enumeratorPromise.then(async devices => {
      devices.forEach(device => {
        if (device.kind === 'audioinput') {
          this.audioDevices.push(device)
        }
      })
      this.audioDevice = this.audioDevices[0].deviceId
      this.recognizer = await this.createModel()
      this.classLabels = this.recognizer.wordLabels() // get class labels
      
      this.setupRecognizer(this.audioDevice)
    })
  },
  beforeDestroy() {
    if (this.recognizer) {
      this.recognizer.stopListening()
    }
  },
  methods: {
    async setupRecognizer (deviceId) {
      if (this.recognizer.isListening()) {
        await this.recognizer.stopListening()
      }
      // listen() takes two arguments:
      // 1. A callback function that is invoked anytime a word is recognized.
      // 2. A configuration object with adjustable fields
      await this.recognizer.listen(result => {
        this.handlePredictions(result.scores)
      }, {
          includeSpectrogram: false, // in case listen should return result.spectrogram
          probabilityThreshold: 0.75,
          invokeCallbackOnNoiseAndUnknown: true,
          overlapFactor: 0.5, // probably want between 0.5 and 0.75. More info in README
          audioTrackConstraints: {
            deviceId: deviceId
          }
      })
    },
    async createModel() {
        const baseURL = `${location.protocol}//${location.host}`
        const checkpointURL = `${baseURL}/speech/model.json`
        const metadataURL = `${baseURL}/speech/metadata.json`
        const recognizer = speechCommands.create(
            'BROWSER_FFT',
            undefined,
            checkpointURL,
            metadataURL)
        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded()
        return recognizer
    },
    handlePredictions (predictions) {
        this.predictions.length = 0
        
        predictions.forEach((prediction, index) => {
            this.predictions.push({
              name: this.classLabels[index],
              score: (prediction * 100).toFixed(1)
            })
        })
        const pred = this.topPrediction
        if (pred.name !== 'Background Noise') {
          this.$emit('word', pred.name.toLowerCase())
        }
    }
  }
}
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
table {
  width: 100%;
  border-spacing: 5px;
}
.margin-10 {
  margin: 10px;
}
.top-row {
  background-color: rgba(0, 200, 0, 0.1);
  height: 40px;
  font-weight: 900;
}
.other-rows {
  background-color: rgba(200, 0, 0, 0.1);
  height: 30px;
  font-weight: 400;
}
td {
  padding: 5px;
}
td:nth-child(1) {
  width: 70%;
    text-align: left;
}
td:nth-child(2) {
  width: 30%;
  text-align: center;
}
.center-container {
  width: 600px;
  margin: 0 auto;
}
.device-select {
  width: 100%;
}
</style>