<script setup>
import RaceDays from './components/RaceDays.vue';
import { ref, onMounted } from 'vue';
import * as racelog from '@/racelog.js';

const raceDays = ref();
onMounted(async () => {
  await racelog.init();
  raceDays.value = await racelog.getRaceDays();
});
</script>

<template>
  <main>
    <RaceDays :raceDays="raceDays" />
  </main>
</template>

<style scoped>

</style>
