<script setup>
import RaceDay from './RaceDay.vue';

defineProps({
    raceDays: {
        required: true
    }
});
</script>

<template>
    <RaceDay v-for="raceDay in raceDays" :raceDay="raceDay"/>
</template>

<style scoped>

</style>
