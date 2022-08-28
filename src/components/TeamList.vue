<script setup>
import { computed, ref } from '@vue/reactivity';

const props = defineProps({
    teams: {
        required: true
    }
});

const top3 = computed(() => {
    return props.teams.slice(0, 3)
});
const losers = computed(() => {
    return props.teams.slice(3);
});

const showLosers = ref(false);
</script>

<template>
<table>
    <tr class="top3" v-for="t in top3" :key="t.id">
        <td class="sep">{{t.time}}</td>
        <td>{{t.captain}}</td>
        <td>{{t.pick1}}</td>
        <td>{{t.pick2}}</td>
        <td>{{t.pick3}}</td>
        <td>{{t.pick4}}</td>
    </tr>
    <tr v-for="t in losers" :key="t.id" v-if="showLosers">
        <td class="sep">{{t.time}}</td>
        <td>{{t.captain}}</td>
        <td>{{t.pick1}}</td>
        <td>{{t.pick2}}</td>
        <td>{{t.pick3}}</td>
        <td>{{t.pick4}}</td>
    </tr>
</table>
<i class="uparrow" v-if="showLosers" @click="showLosers = false"></i>
<i class="downarrow" v-else @click="showLosers = true"></i>
</template>

<style scoped>
table {
    border-spacing: 0;
}
td {
    padding: 10px;
    margin: 0;
}
tr:not(:last-child)>td {
    border-bottom: solid var(--color-text);
}
.sep {
   border-right: solid var(--color-text);
}
.downarrow {
    border: solid var(--color-text);
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    cursor: pointer;
}

.uparrow {
    border: solid var(--color-text);
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    cursor: pointer;
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
}
</style>
