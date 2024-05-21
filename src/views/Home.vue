<template>
    <div class="home">
        <h1>Home</h1>
        <div class="container">
            <Editor />
        </div>
        <p class="info">Developed by <a href="https://michela-z.github.io/">Michela Zallocco</a></p>
    </div>
</template>

<script setup>
    import Editor from '../components/Editor.vue'
</script>

<style>
    .info {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%)
    }
    a {
        text-decoration: none;
        color: #2e7eff;
    }
</style>