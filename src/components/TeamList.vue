<script>
    export default {
        props: ['teams']
    }
</script>

<template>
<table>
    <tr v-for="t in teams" :key="t.id">
        <th>{{t.prettyDate }}</th>
        <th>{{t.time}}</th>
        <th>{{t.position}}</th>
        <th>{{t.captain}}</th>
        <th>{{t.pick1}}</th>
        <th>{{t.pick2}}</th>
        <th>{{t.pick3}}</th>
        <th>{{t.pick4}}</th>
    </tr>
</table>
</template>

<style scoped>

</style>
