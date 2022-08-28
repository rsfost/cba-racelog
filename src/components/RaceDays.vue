<script setup>
import RaceDay from './RaceDay.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import * as racelog from '@/racelog.js';

const raceDays = ref([]);
const scrollComponent = ref();
const nextIndex = ref(0);
const pageSize = 5;

let nextPageLock = false;

const nextPage = async () => {
    if (nextPageLock) {
        return;
    }
    nextPageLock = true;
    const nextDays = await racelog.getRaceDays(nextIndex.value, pageSize);
    raceDays.value.push(...nextDays);
    nextIndex.value += pageSize;
    nextPageLock = false;
};

const handleScroll = async (e) => {
    let element = scrollComponent.value;
    if (element.getBoundingClientRect().bottom < window.innerHeight) {
        await nextPage();
    }
};

onMounted(async () => {
    window.addEventListener("scroll", handleScroll)
    await racelog.init();
    await nextPage();
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll)
})
</script>

<template>
<div ref="scrollComponent">
    <RaceDay v-for="raceDay in raceDays" :raceDay="raceDay"/>
</div>
</template>

<style scoped>

</style>
