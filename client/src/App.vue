<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from './store/main.ts';
import { storeToRefs } from 'pinia';

const location = useRoute();
const router = useRouter();
const store = useStore();

const {
  getusername: username,
  getToken: token
} = storeToRefs(store)


function logout() {
  localStorage.removeItem("user");
  router.push({ path: '/' })
}

onMounted(function () {
  var cookie =  localStorage.getItem("user");
  if(cookie) {store.setUser(cookie)};
  if (token) {
    router.push({ path: '/chat' })
  } else {
    router.push({ path: '/' })
  }
})

</script>

<template>
  <div id="page-container">
    <div id="content-wrap">
      <nav>
        username: {{ username }}
        <ul>
          <li v-for="(route, index) in router.options.routes" :key="index">
            <router-link :to="route.path">
              {{ route.name }}
            </router-link>
          </li>
          <li class="link" @click="logout"><a href="#">/log out</a></li>
        </ul>
      </nav>
      <div class="container">
        <router-view />
      </div>
    </div>
    <footer id="footer"><i>current path: {{ location.path }}</i></footer>
  </div>


  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
#page-container {
  position: relative;
  min-height: 100vh;
}

#content-wrap {
  padding-bottom: 2.5rem;
  /* Footer height */
}

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;
  /* Footer height */
}

nav ul {
  display: flex;
}

nav li {
  margin-left: 10px;
  list-style: none;
}
</style>
