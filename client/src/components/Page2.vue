<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from './store/main.ts';

const router = useRouter();

import Socket from '../components/Socket.vue';

  onMounted( function () {
      const tokenCookie =  localStorage.getItem("user");
      if(tokenCookie){
          router.push({ path: '/page2' })
      }else{
          router.push({ path: '/' })
      }
  })

</script>

<template>
  <h1>page 2</h1>
  <Socket />
</template>

<style scoped>

</style>
