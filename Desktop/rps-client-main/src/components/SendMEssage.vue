<template>
    <div>
        <button @click="sendMessage()">Send message</button>
    </div>
</template>
<script>
export default {
    props: [
        'screen'
], methods: {
        sendMessage() {
            this.$socket.emit('message', {
                screen: this.screen
            })
} }
} </script>