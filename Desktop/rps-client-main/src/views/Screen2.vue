<template>
    <div>
        <h1>Screen 2</h1>
        <router-link to="/screen3">Screen3</router-link> 
    <div>
            <button @click="sendMessage('Hello from screen 1')">Send message</button> 
        </div>
<router-link to="/screen3">screen3</router-link> 
</div>
    
</template>

<script>
import SendMEssage from '../components/SendMEssage'
export default {
    components: { SendMEssage },
}
</script>