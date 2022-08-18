<script setup>
import { ref, onMounted } from 'vue';
import * as racelog from '@/racelog.js';

const races = ref([]);

onMounted(async () => {
    await racelog.init();
    races.value = await racelog.getAll();
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
    <tr v-for="r in races" :key="r.id">
        <th>{{r.prettyDate }}</th>
        <th>{{r.time}}</th>
        <th>{{r.position}}</th>
        <th>{{r.captain}}</th>
        <th>{{r.pick1}}</th>
        <th>{{r.pick2}}</th>
        <th>{{r.pick3}}</th>
        <th>{{r.pick4}}</th>
    </tr>
</table>
</template>

<style scoped>

</style>
