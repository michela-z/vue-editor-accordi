<template>
    <div class="navbar">
        <h1 class="titolo-app">Editor Accordi</h1>
        <ul class="nav-link">
            <router-link class="link" to="/">Home</router-link>
            <router-link class="link" to="/salvati" active-class="active">Salvati</router-link>
        </ul>
    </div>
</template>

<script setup>
</script>

<style scoped>
    .cuore {
        cursor: pointer;
    }
    .link{
        color: white;
        text-decoration: none;
        padding-right: 20px;
    }
    .active {
        font-weight: bolder;
    }
</style>