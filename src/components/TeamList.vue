<script setup>
defineProps({
    teams: {
        required: true
    }
});
</script>

<template>
<table>
    <tr v-for="t in teams" :key="t.id">
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
</style>
