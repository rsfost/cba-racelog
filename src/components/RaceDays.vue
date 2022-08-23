<script setup>
import TeamList from './TeamList.vue';
import { prettyPrintDate } from '@/utils.js';
defineProps({
    raceDays: {
        required: true
    }
});
</script>

<template>
    <div v-for="raceDay in raceDays">
        <div class="date">
            <h1>{{ prettyPrintDate(raceDay.date) }}</h1>
        </div>
        <div>
            MVP ({{ raceDay.mvp.wins }} wins): {{ raceDay.mvp.players.join(', ') }}
        </div>
        <div v-for="(teams, key) in raceDay.races">
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
