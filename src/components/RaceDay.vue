<script setup>
import TeamList from './TeamList.vue';
import { prettyPrintDate } from '@/utils.js';
import { ref, onMounted, watch } from 'vue';

const stats = ref();

const props = defineProps({
    raceDay: {
        required: true
    }
});

onMounted(async () => {
    const localStats = await props.raceDay.stats;
    stats.value = localStats;
    console.log(localStats);
});
</script>

<template>
<div class="raceDay">
    <div class="date">
        <h1>{{ prettyPrintDate(raceDay.date) }}</h1>
    </div>
    <div>
        MVP ({{ raceDay.mvp.wins }} wins): {{ raceDay.mvp.players.join(', ') }}
    </div>
    <div class="race" v-for="(teams, key) in raceDay.races">
        <h2>Race {{ key + 1 }}</h2>
        <TeamList :teams="teams"/>
    </div>
</div>

</template>

<style scoped>
.date {
    top: 0;
    position: sticky;
    background: var(--color-background-layer1);
    z-index: 10;
}

.raceDay {
    background: var(--color-background-layer1);
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.race {
    margin-bottom: 10px;
}
</style>
