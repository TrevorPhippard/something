
<script setup lang="ts" >
import { ref, onMounted,  onUnmounted } from 'vue'
import SocketioService from '../services/socketio.service.js';
import { useStore } from '../store/main.ts';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const {
  getUsername: username,
  getToken: token
} = storeToRefs(store)

const inputMessageText = ref('')
const messages = ref({ msg: [] });

onMounted( function () {
  if(token.value){
    SocketioService.setupSocketConnection(token.value);
    SocketioService.subscribeToMessages((_err, data) => {
      messages.value.msg.push(data);
    });
  }else{
   return router.push({ path: '/' })
  }
})

onUnmounted(() => SocketioService.disconnect());

function submitMessage() {
  const CHAT_ROOM = "myRandomChatRoomId";
  const SENDER = {
    name: username.value,
    id: "123",
  };
  
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
      <form class="input-div" @submit.prevent="submitMessage">
        <textarea type="text" placeholder="Type in text" v-model="inputMessageText" />
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

.box textarea{
  padding:  10px;
  min-height: 20px;
  max-height: 90px;
  min-width: 20px;
  max-width: 600px;
}

.messages {
  padding: 10px;
  flex-grow: 1;
  text-align: left;
}

.input-div {
  display: flex;
  width: 100%;
}
</style>