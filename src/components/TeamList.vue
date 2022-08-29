<script setup>
import { computed, ref } from '@vue/reactivity';

const props = defineProps({
    header: {
        required: false
    },
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
<h2>
    {{ header }}
    <div class="arrow down" v-if="showLosers" @click="showLosers = false"></div>
    <div class="arrow right" v-else @click="showLosers = true"></div>
</h2>
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

.arrow {
    --size: 8px;
    width: 0;
    height: 0;
    display: inline-block;
    cursor: pointer;
}

.arrow.up {
  border-left: var(--size) solid transparent;
  border-right: var(--size) solid transparent;
  border-bottom: var(--size) solid var(--color-text);
}

.arrow.down {
  border-left: var(--size) solid transparent;
  border-right: var(--size) solid transparent;
  border-top: var(--size) solid var(--color-text);
}

.arrow.right {
  border-top: var(--size) solid transparent;
  border-bottom: var(--size) solid transparent;
  border-left: var(--size) solid var(--color-text);
}

.arrow.left {
  border-top: var(--size) solid transparent;
  border-bottom: var(--size) solid transparent;
  border-right: var(--size) solid var(--color-text);
}
</style>
