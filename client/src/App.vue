<script setup lang="ts">

  import { onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useStore } from './store/main.ts';
  import { storeToRefs } from 'pinia';

  import Socket from './components/Socket.vue'

  const location = useRoute();
  const router = useRouter();
  const store = useStore();

  const {
    getUsername: username
  } = storeToRefs(store)


  onMounted(async function (){
    store.login({
      "Email": "trevor@trevor.com", 
    "Password": "trevor"
    })
  //  var newData =  await store.getData();
    // store.changeUserName(newData.username)

  })
</script>

<template>
  <h1>{{ username }}</h1>
  <i>current path: {{ location.path }}</i>
  <div>
     <nav>
      <ul>

      <li v-for="(route, index) in router.options.routes" :key="index">
          <router-link :to="route.path">
          {{ route.name }}
          </router-link>
      </li>
    </ul>

    </nav>
  </div>  <div class="container">
    <router-view/>
  </div>
  <Socket/>

  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
nav ul {
  display: flex;
}
nav li {
  margin-left: 10px;
  list-style: none;
}
</style>
