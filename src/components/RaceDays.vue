<script setup>
import { ref, onMounted } from 'vue';
import * as racelog from '@/racelog.js';
import TeamList from './TeamList.vue';

const raceDays = ref();

onMounted(async () => {
    await racelog.init();
    raceDays.value = await racelog.getRaceDays();
});

</script>

<template>
    <div v-for="[date, races] in raceDays">
        <h1>{{ date }}</h1>
        <TeamList v-for="teams in races" :teams="teams"/>
    </div>
</template>

<style scoped>

</style>
