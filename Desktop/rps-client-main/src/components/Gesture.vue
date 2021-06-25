<template>
  <v-card-text>
    <v-select
      :items="devices"
      v-model="videoDevice"
      item-text="label"
      item-value="deviceId"
    />
    <video ref="video"></video>
    <div>
      <table>
        <tr v-for="(prediction, index) in predictions" v-bind:key="index">
          <td>
            <label :for="prediction.name">{{ prediction.name }}</label>
          </td>
          <td>
            <meter
              :id="prediction.name"
              :value="prediction.score"
              min="0"
              max="100"
            />
          </td>
        </tr>
      </table>
    </div>
  </v-card-text>
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";
export default {
  name: "App",
  components: {},
  data() {
    return {
      videoDevice: "",
      devices: [],
      baseModel: "mobilenet_v2",
      isModelReady: false,
      predictions: [
        { name: 'Rock', score: 0 },
        { name: 'Paper', score: 0 },
        { name: 'Scissors', score: 0 }
      ],
      lastPrediction: "",
    };
  },
  mounted() {
    tf.setBackend("webgl");
    this.listVideoDevices()
      .then((videoDevices) => {
        for (let device of videoDevices) {
          this.devices.push(device);
        }
        this.videoDevice = videoDevices[0].deviceId;
      })
      .then(() => {
        return this.initWebcamStream();
      })
      .then(() => {
        return this.loadModel().then(() => {
          this.detectObjects();
        });
      });
  },
  beforeDestroy() {
    if (this.raf) {
      let video = this.$refs.video
      video.pause()
      video.srcObject = null
      
      this.stream.getTracks().forEach(track => {
        track.stop()
      })
      this.isVideoStreamReady = false
      cancelAnimationFrame(this.raf)
    }
  },
  methods: {
    listVideoDevices() {
      return navigator.mediaDevices.enumerateDevices().then((devices) => {
        return devices.filter((device) => device.kind === "videoinput");
      });
    },
    initWebcamStream() {
      this.isVideoStreamReady = false;
      // if the browser supports mediaDevices.getUserMedia API
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return (
          navigator.mediaDevices
            .getUserMedia({
              video: { deviceId: this.videoDevice },
            })
            .then((stream) => {
              this.stream = stream
              // set <video> source as the webcam input
              let video = this.$refs.video
              video.srcObject = this.stream;
              return new Promise((resolve) => {
                // when video is loaded
                video.onloadedmetadata = () => {
                  // calculate the video ratio
                  this.videoRatio = video.videoHeight / video.videoWidth;
                  // add event listener on resize to reset the <video> and <canvas> sizes
                  this.isVideoStreamReady = true;
                  video.play()
                  resolve();
                };
              });
            })
            // error handling
            .catch((error) => {
              console.log("failed to initialize webcam stream", error);
            })
        );
      }
    },
    loadModel() {
      return tmImage
        .load("/gesture/model.json", "/gesture/metadata.json")
        .then((model) => {
          this.model = model;
          this.isModelReady = true;
        })
        .catch((error) => {
          console.log("failed to load the mode", error);
          throw error;
        });
    },
    detectObjects() {
      if (!this.isModelReady) return;
      if (this.isVideoStreamReady) {
        this.model.predict(this.$refs.video).then((predictions) => {
          this.handlePredictions(predictions);
          this.raf = requestAnimationFrame(() => {
            this.detectObjects();
          });
        });
      } else {
        this.raf = requestAnimationFrame(() => {
          this.detectObjects();
        });
      }
    },
    handlePredictions(predictions) {
      this.predictions.splice(0);
      let maxPrediction;
      let maxProb = 0;
      predictions.forEach((prediction) => {
        this.predictions.push({
          name: prediction.className,
          score: (prediction.probability * 100).toFixed(1),
        });
        if (prediction.probability > maxProb) {
          maxProb = prediction.probability;
          maxPrediction = prediction;
        }
      });
      if (this.lastPrediction != maxPrediction.className) {
        this.lastPrediction = maxPrediction.className;
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          if (this.lastPrediction != 'Nothing') {
            this.$emit('gesture', this.lastPrediction.toLowerCase())
          }
        }, 1500)
      }
    },
  },
};
</script>

<style>
video {
  width: 100%;
}
</style>