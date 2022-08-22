<script setup>
import RaceDays from './components/RaceDays.vue';
import { ref, onMounted } from 'vue';
import * as racelog from '@/racelog.js';

const raceDays = ref();
onMounted(async () => {
  const minWait = new Promise(resolve => setTimeout(resolve, 500));
  await Promise.all([racelog.init(), minWait]);
  raceDays.value = racelog.getRaceDays();
});
</script>

<template>
  <main>
    <RaceDays :raceDays="raceDays" />
  </main>
</template>

<style scoped>

</style>
