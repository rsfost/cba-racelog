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
<h2 class="header" @click="showLosers = !showLosers">
    {{ header }}
    <div class="arrow down" v-if="showLosers"></div>
    <div class="arrow right" v-else></div>
</h2>
<div class="tableWrapper">
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
</div>
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

.tableWrapper {
    overflow-x: scroll;
}

.sep {
   border-right: solid var(--color-text);
}

.header {
    cursor: pointer;
    width: max-content;
}

.arrow {
    --size: 8px;
    width: 0;
    height: 0;
    display: inline-block;
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
