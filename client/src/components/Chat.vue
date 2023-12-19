<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from './store/main.ts';

const router = useRouter();

import Socket from '../components/Socket.vue';

  onMounted( function () {
      const tokenCookie =  localStorage.getItem("user");
    
      console.log('tokenCookie:', tokenCookie)
      if(tokenCookie){
          router.push({ path: '/chat' })
      }else{
          router.push({ path: '/' })
      }
  })

</script>

<template>
  <Socket />
</template>

<style scoped>

</style>
