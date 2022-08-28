<script setup>
import TeamList from './TeamList.vue';
import { prettyPrintDate } from '@/utils.js';
import { ref, onMounted, watch } from 'vue';

const winrateLeaders = ref();
const captainLeaders = ref();

const props = defineProps({
    raceDay: {
        required: true
    }
});

onMounted(async () => {
    const localStats = await props.raceDay.stats;
    winrateLeaders.value = localStats.topWinrates;
    captainLeaders.value = localStats.topCaptains;
});

function toPercentStr(ratio) {
    return `${(ratio * 100).toFixed(1)}`;
}
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
    <div class="statWrapper">
        <h3 style="text-align: center;">Leaderboard</h3>
        <div class="stats">
            <div>
                <h3 title="Past year" style="text-align: center;">Winrates</h3>
                <ol>
                    <li v-for="leader in winrateLeaders">
                        {{ toPercentStr(leader.winrate) }} {{ leader.player }}
                    </li>
                </ol>
            </div>
            <div>
                <h3 title="Past year" style="text-align: center;">Captains</h3>
                <ol>
                    <li v-for="leader in captainLeaders">
                        {{ toPercentStr(leader.pickWinrate[0]) }} {{ leader.player }}
                    </li>
                </ol>
            </div>
        </div>
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

.statWrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.stats {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>
