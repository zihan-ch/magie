<template>
    <h1>Messages:</h1>
    <input v-model="sendingMessage">
    <button @click="sendMessage">Send</button>
    <ul>
        <li v-for="message of messages">{{message}}</li>
    </ul>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue';
import axios from 'axios';

let messages = ref([]);
onMounted(async () => {
    messages.value = await (await fetch('/api/message-list')).json();
});

let sendingMessage = ref('');

async function sendMessage() {
    await axios.post('/api/send', sendingMessage.value);
    messages.value = await (await fetch('/api/message-list')).json();
    sendingMessage.value = '';
}
</script>