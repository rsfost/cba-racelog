<script setup>
import TeamList from './TeamList.vue';
import { prettyPrintDate } from '@/utils.js';
import { ref, onMounted, watch } from 'vue';

const winrateLeaders = ref();
const captainLeaders = ref();
const sleeperLeaders = ref();

const props = defineProps({
    raceDay: {
        required: true
    }
});

onMounted(async () => {
    const localStats = await props.raceDay.stats;
    winrateLeaders.value = localStats.topWinrates;
    captainLeaders.value = localStats.topCaptains;
    sleeperLeaders.value = localStats.topSleepers;
});

function toPercentStr(ratio) {
    return `${(ratio * 100).toFixed(1)}`;
}

function raceHeader(index) {
    return "Race " + (index + 1);
}
</script>

<template>
<div class="raceDay">
    <div class="date">
        <h1>{{ prettyPrintDate(raceDay.date) }}</h1>
    </div>
    <div class="mvp">
        MVP ({{ raceDay.mvp.wins }} wins): {{ raceDay.mvp.players.join(', ') }}
    </div>
    <div class="race" v-for="(teams, key) in raceDay.races">
        <TeamList :teams="teams" :header="raceHeader(key)"/>
    </div>
    <div class="statWrapper">
        <h3 style="text-align: center;">Leaderboard</h3>
        <div class="stats">
            <div>
                <h3 title="Past year" style="text-align: center;">Overall</h3>
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
            <div>
                <h3 title="Top winrates as third or fourth pick" style="text-align: center;">Sleepers</h3>
                <ol>
                    <li v-for="leader in sleeperLeaders">
                        {{ toPercentStr(leader.sleeperWinrate) }} {{ leader.player }}
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
    padding-left: 20px;
}

.raceDay {
    background: var(--color-background-layer1);
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.race {
    margin-bottom: 10px;
    padding-left: 20px;
    padding-right: 20px;
}

.mvp {
    padding-left: 20px;
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
    flex-wrap: wrap;
}

li {
    white-space: nowrap;
}
</style>
