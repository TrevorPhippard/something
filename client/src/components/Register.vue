<script setup lang="ts">

import { ref } from 'vue'
import { useStore } from '../store/main.ts';
import {  useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

var email = ref('trevor@trevor.com');
var password = ref('trevor');

function submitToken(e) {
  var formData = {
    "Email": email.value,
    "Password": password.value
  }

  store.login(formData).then(function(){
    router.push({ path: '/page2' })
  });

};

function one(e){
  console.log('a', e.target)
}

function two(e){
  console.log('b', e.target)
}

</script>

<template>
  <div class="container">
    <div class="card">
      <form @submit.prevent="">
        <input type="text" placeholder="E-Mail" v-model="email">
        <input type="password" placeholder="Password" v-model="password">
        <div class="buttons">
          <button  @click="one" class="register-button">Register</button>
          <button  @click="submitToken" type="submit" class="login-button">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.card {
  width: 300px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  border-top: 4px solid #2f19be;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 10px;
  border: none;
  background-color: transparent;
  border-bottom: 1px solid #ccc;
  color: #333;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.login-button {
  padding: 10px 20px;
  background-color: #2f19be;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.register-button {
  padding: 10px 20px;
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 480px) {
  .card {
    width: 100%;
    max-width: 300px;
  }
}
</style>
