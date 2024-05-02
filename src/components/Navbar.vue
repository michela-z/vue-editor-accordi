<template>
    <div class="navbar">
        <h1 class="titolo-app">Editor Accordi</h1>
        <h3 @click="apriPreferiti" class="cuore">❤</h3>
        <Preferiti v-show="mostra.value"/>
    </div>
</template>

<script setup>
    import Preferiti from './Preferiti.vue';
    import { mostra } from './mostra-preferiti.js';

    function apriPreferiti() {
        mostra.value = !mostra.value
        console.log("mod", mostra.value)
    }
</script>

<style scoped>
.cuore {
    cursor: pointer;
}
</style>