
<script setup lang="js" >
import {ref, onMounted , onUnmounted } from 'vue'
import SocketioService from '../services/socketio.service.js';
import { useStore } from '../store/main.ts';
import { storeToRefs } from 'pinia';

const store = useStore();

const {
  getToken: tokenString
} = storeToRefs(store)

// static data only for demo purposes, in real world scenario, this would be already stored on client
const SENDER = {
  id: "123",
  name: "John Doe",
};

const inputMessageText = ref('')
var token= ref(tokenString);
var messages= ref({msg:[]});


function submitToken() {
      console.log(token.value);
      SocketioService.setupSocketConnection(token.value);
      SocketioService.subscribeToMessages((err, data) => {
        console.log('data:::',data);
        messages.value.msg.push(data);
      });
};

function submitMessage() {
  const CHAT_ROOM = "myRandomChatRoomId";
  const message = inputMessageText.value;

  SocketioService.sendMessage({ message, roomName: CHAT_ROOM }, cb => {
    // callback is acknowledgement from server
    console.log(cb);
    messages.value.msg.push({
      message,
      ...SENDER
    });
    // clear the input after the message is sent
    inputMessageText.value = '';
  });
}

// onMounted(async function (){
//   SocketioService.setupSocketConnection('myRandomHash');
//   SocketioService.subscribeToMessages((err, data) => {
//     console.log(data);
//     messages.value.push(data);
//   });
// })
  
onUnmounted(() => SocketioService.disconnect());

</script>
<template>
  <div>
    {{  messages }}
    <form @submit.prevent="submitToken">
      <input type="text" placeholder="Enter token" v-model="token" />
      <button type="submit">Submit</button>
    </form>
    <div class="box">
      <div class="messages">
        <div v-for="user in messages.msg" :key="user.id">
          {{user.name}}: {{user.message}}
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