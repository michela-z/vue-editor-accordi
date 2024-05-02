<template>
    <div class="cnt-preferiti">
        <h3>I tuoi testi salvati </h3>
        <ul class="preferiti">
            <li v-for="(titolo, index) in preferiti" :index="index" @click="mostraPreferito">{{ titolo }}</li>
        </ul>
    </div>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { mostra } from './mostra-preferiti.js';
    import { preferito } from './preferito.js'

    const preferiti = ref([])

    onMounted(() => {
        let pref = localStorage.getItem("preferiti");
        let prefObj = JSON.parse(pref)

        for (let index = 0; index < prefObj.length; index++) {
            preferiti.value.push(prefObj[index].titolo)
        }
    })

    watch(mostra, () => {
        preferiti.value = []
        let pref = localStorage.getItem("preferiti");
        let prefObj = JSON.parse(pref)

        for (let index = 0; index < prefObj.length; index++) {
            preferiti.value.push(prefObj[index].titolo)
        }

    }, { deep: true })

    function mostraPreferito(e) {
        preferito.titoloPref = e.target.innerText;
        preferito.index = e.target.attributes.index.value;
    }

    // MANTENERE GLI ACCORDI NEI PREFERITI:
    // copiare l'innerHTML di container-testo

</script>

<style scoped>
    .cnt-preferiti {
        position: absolute;
        background-color: white;
        border-radius: 30px;
        color: #adadad;
        border: solid 1px rgb(205, 205, 205);
        right: 10%;
        top: 60px;
        width: 300px;
        padding: 20px;

        z-index: 30;
    }

    .preferiti {
        list-style: none;
        cursor: pointer;
    }

    .li:hover {
        color: #2e7eff;
    }

    h3 {
        color: #3e3e3e;
    }
</style>