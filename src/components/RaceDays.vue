<script setup>
import { ref, onMounted } from 'vue';
import * as racelog from '@/racelog.js';
import TeamList from './TeamList.vue';

const raceDays = ref();

onMounted(async () => {
    await racelog.init();
    raceDays.value = await racelog.getRaceDays();
});

function prettyPrintDate(date) {
    let monthStr;
    switch (date.getMonth()) {
        case 0:
            monthStr = 'January';
            break;
        case 1:
            monthStr = 'February';
            break;
        case 2:
            monthStr = 'March';
            break;
        case 3:
            monthStr = 'April';
            break;
        case 4:
            monthStr = 'May';
            break;
        case 5:
            monthStr = 'June';
            break;
        case 6:
            monthStr = 'July';
            break;
        case 7:
            monthStr = 'August';
            break;
        case 8:
            monthStr = 'September';
            break;
        case 9:
            monthStr = 'October';
            break;
        case 10:
            monthStr = 'November';
            break;
        case 11:
            monthStr = 'December';
            break;
        default:
            monthStr = date.getMonth().toString();
            break;
    }
    return `${monthStr} ${date.getDate()}, ${date.getFullYear()}`;
}
</script>

<template>
    <div v-for="[date, races] in raceDays">
        <div class="date">
            <h1>{{ prettyPrintDate(date) }}</h1>
        </div>
        <div v-for="(teams, key) in races">
            <h2>Race {{ key + 1 }}</h2>
            <TeamList :teams="teams"/>
        </div>
    </div>
</template>

<style scoped>
.date {
    top: 0;
    position: sticky;
    background: var(--color-background);
    z-index: 10;
}
</style>
