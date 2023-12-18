
<script setup lang="ts" >
import { ref, onMounted,  onUnmounted } from 'vue'
import SocketioService from '../services/socketio.service.js';
import { useStore } from '../store/main.ts';
import { storeToRefs } from 'pinia';



const store = useStore();
const {
  getUsername: username
} = storeToRefs(store)

// static data only for demo purposes, in real world scenario, this would be already stored on client
const SENDER = {
  id: "123",
  name: username.value,
};

const inputMessageText = ref('')
var messages = ref({ msg: [] });

onMounted( function () {
  console.log('subscribe to socket')
  SocketioService.subscribeToMessages((_err, data) => {
    messages.value.msg.push(data);
  });
})

onUnmounted(() => SocketioService.disconnect());

function submitMessage() {
  const CHAT_ROOM = "myRandomChatRoomId";
  const message ={ text: inputMessageText.value, ...SENDER }
  
  SocketioService.sendMessage({ message, roomName: CHAT_ROOM }, cb => {
    // callback is acknowledgement from server
    console.log(cb);
    // @ts-ignore
    messages.value.msg.push({ message });
    inputMessageText.value = '';
  });
}

</script>
<template>
  <div>
    <div class="box">
      <div class="messages">
        <div v-for="info in messages.msg" :key="info.id">
         <strong> {{ info.message.name }}: </strong>{{ info.message.text }}
        </div>
      </div>
      <div class="messages"></div>
      <form class="input-div" @submit.prevent="submitMessage">
        <input type="text" placeholder="Type in text" v-model="inputMessageText" />
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>


<style>
.App {
  padding: 1rem;
}

.box {
  width: fit-content;
  height: 400px;
  border: solid 1px #000;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.messages {
  flex-grow: 1;
}

.input-div {
  display: flex;
  width: 100%;
}
</style>