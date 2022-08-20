<script setup>
import { ref, onMounted } from 'vue';
import * as racelog from '@/racelog.js';

const teams = ref([]);

onMounted(async () => {
    await racelog.init();
    teams.value = await racelog.getTeams();
});
</script>

<template>
<table>
    <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Position</th>
        <th>Captain</th>
        <th>First pick</th>
        <th>Second pick</th>
        <th>Third pick</th>
        <th>Fourth pick</th>
    </tr>
    <tr v-for="t in teams" :key="t.id">
        <th>{{t.prettyDate }}</th>
        <th>{{t.time}}</th>
        <th>{{t.position}}</th>
        <th>{{t.captain}}</th>
        <th>{{t.pick1}}</th>
        <th>{{t.pick2}}</th>
        <th>{{t.pick3}}</th>
        <th>{{t.pick4}}</th>
    </tr>
</table>
</template>

<style scoped>

</style>
