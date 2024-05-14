<template>
    <div class="salvati">
        <div class="container-salvati">
            <div class="header">
                <h1>I tuoi testi salvati</h1>
            </div>
            <ul>
                <li v-for="(titolo, index) in titoli" :index="index" @click="mostraTesto">{{ titolo }}</li>
            </ul>
            <div class="pulsanti">
                <router-link class="link" to="/"><button class="pulsante" @click="modificaTesto">Modifica Testo</button></router-link>
                <button class="pulsante" @click="reset">Elimina testi salvati</button>
            </div>
        </div>

        <div class="testo-salvato" id="element-to-convert">
            <h1 class="titolo">{{ titolo }}</h1>
            <h4 class="autore">{{ autore }}</h4>
            <div class="testoeaccordi" ref="testoeaccordi"></div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { preferito } from '../components/getTesto.js'
    import { testiSalvati } from '../components/testiSalvati';
    import { modifica } from '../components/modifica.js';

    const titoli = ref([])
    const titolo = ref('');
    const autore = ref('');
    const testo = ref('')
    const testoeaccordi = ref(null);

    const indice = ref()

    onMounted(() => {
        if(testiSalvati.length > 0) {
            console.log('pieno');
            testiSalvati.forEach(e => {
                titoli.value.push(e.titolo)
            })
        } else {
            console.log('vuoto');
        }
    })

    function mostraTesto(e) {
        let brani = localStorage.getItem('preferiti');
        let braniObj = JSON.parse(brani);

        indice.value = e.target.attributes.index.value;
        //console.log(indice.value);

        titolo.value = e.target.innerText;
        autore.value = braniObj[indice.value].autore;
        testoeaccordi.value.innerHTML = braniObj[indice.value].testoHTML;
        testo.value = braniObj[indice.value].testo;
        
        //console.log(braniObj[indice.value].testoHTML);
    }

    function reset() {
        titoli.value = [];
        testiSalvati.splice(0)
        localStorage.clear();
    }

    function modificaTesto() {
        //testi salvati
        modifica.value = !modifica.value;
        preferito.titoloPref = titolo.value;
        preferito.autorePref = autore.value;
        preferito.testoPref = testo.value;
        preferito.testoeaccPref = testoeaccordi.value;

        preferito.index = indice.value;
    }
</script>


<style scoped>
    .salvati {
        margin-top: 100px;
        width: 80vw;
        height: 80vh;
        flex-direction: row;
        display: flex;
        justify-content: flex-end;
    }
    li {
        text-decoration: none;
        list-style: none;
        margin-bottom: 10px;
    }
    .container-salvati {
        position: fixed;
        top: 10%;
        left: 10%;
        height: 80vh;
    }
    .pulsanti {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: inherit;
        bottom: 10%;
        left: 10%;
    }
    .header {
        /* border: solid #00ffb7 1px; */
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 20px 0;
        height: 50px;
    }
    .testo-salvato {
        padding: 20px;
        display: flex;
        flex-direction: column;
        min-width: 400px;
        max-width: 400px
    }
</style>