<script setup>
import TeamList from './TeamList.vue';
</script>

<script>
export default {
    props: ['raceDays']
}
function prettyPrintDate(date) {
    let dateParts;
    date = date || '01/01/1901';
    dateParts = date.split('/');
    if (!dateParts || dateParts.length < 3) {
        dateParts = ['01', '01', '1901'];
    }
    let monthStr;
    switch (parseInt(dateParts[1])) {
        case 1:
            monthStr = 'January';
            break;
        case 2:
            monthStr = 'February';
            break;
        case 3:
            monthStr = 'March';
            break;
        case 4:
            monthStr = 'April';
            break;
        case 5:
            monthStr = 'May';
            break;
        case 6:
            monthStr = 'June';
            break;
        case 7:
            monthStr = 'July';
            break;
        case 8:
            monthStr = 'August';
            break;
        case 9:
            monthStr = 'September';
            break;
        case 10:
            monthStr = 'October';
            break;
        case 11:
            monthStr = 'November';
            break;
        case 12:
            monthStr = 'December';
            break;
        default:
            monthStr = dateParts[1];
            break;
    }
    return `${monthStr} ${dateParts[0]}, ${dateParts[2]}`;
}
</script>

<template>
    <div v-for="raceDay in raceDays">
        <div class="date">
            <h1>{{ prettyPrintDate(raceDay.date) }}</h1>
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
