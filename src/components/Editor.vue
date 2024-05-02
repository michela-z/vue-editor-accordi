<template>
    <div class="editor">
        <label for="titolo">Inserisci il titolo</label>
        <textarea name="titolo" id="titolo" cols="45" rows="1" v-model="titolo"></textarea>

        <label for="autore">Inserisci l'autore</label>
        <textarea name="autore" id="autore" cols="45" rows="1" v-model="autore"></textarea>

        <label for="testo">Inserisci il testo</label>
        <textarea name="testo" id="testo" cols="45" rows="10" v-model="testo">{{ testo }}</textarea>

        <div class="pulsanti">
            <button class="pulsante" @click="elaboraTesto"> elabora </button>
            <button class="pulsante" @click="salva">❤</button>
        </div>

        <label for="titolo">Quali accordi vuoi inserire sul testo?</label>

        <div class="modifica-accordi">
            <input type="text" class="get-accordo" onfocus="this.value=''" v-model="accordo">
            <button class="aggiungi" @click="getAccordo">add</button>
            <button class="rimuovi" @click="rimuoviAccordo">remove</button>
        </div>

        <label for="titolo">Seleziona l'accordo che vuoi inserire sul testo</label>

        <div class="cnt-accordi">
            <button v-for="(accordo, index) in accordi" class="btn-accordo" @click="selezionato" :class="{ 'active': index === indice }" :index="index" ref="accSel">{{ accordo }}</button>
        </div>

        <div class="guida">
            <p><b>Evidenzia</b> il ritornello cliccando col tasto destro del mouse sulla linea desiderata, clicca col il sinistro per annullare.</p>
            <p><b>Elimina</b> l'accordo inserito cliccando di nuovo sullo stesso.</p>
        </div>

        <button id="download-pdf" class="pulsante" @click="exportToPDF">Download PDF</button>
    </div>


    <div class="cnt-testo-finale" id="app" ref="document">
        <div class="container-testo" id="element-to-convert">
            <h1 class="titolo">{{ titolo }}</h1>
            <h4 class="autore">{{ autore }}</h4>

            <div class="pagina-1 pagina">
                <div class="cnt-acc-frase" v-for="(frase, index) in frasiUno" >
                    <div class="accordi-formattati" @click="inserisciAccordo" :index="index" ref="container"></div>
                    <p class="testo-formattato" ref="pag1" :index="index" @contextmenu.prevent="evidenziaRit" @click="resetBold">{{ frase }}</p>
                </div>
            </div>

            <div class="pagina-2 pagina">
                <div class="cnt-acc-frase" v-for="(frase, index) in frasiDue" >
                    <div class="accordi-formattati" @click="inserisciAccordo" :index="index" ref="container"></div>
                    <p class="testo-formattato" ref="pag2" :index="index" @contextmenu.prevent="evidenziaRit" @click="resetBold">{{ frase }}</p>
                </div>
            </div>

            <div class="pagina-3 pagina">
                <div class="cnt-acc-frase" v-for="(frase, index) in frasiTre" >
                    <div class="accordi-formattati" @click="inserisciAccordo" :index="index" ref="container"></div>
                    <p class="testo-formattato" ref="pag3" :index="index" @contextmenu.prevent="evidenziaRit" @click="resetBold">{{ frase }}</p>
                </div>
            </div>

        </div>
    </div>

</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { preferito } from './preferito.js'
import html2pdf from "html2pdf.js";

const titolo = ref('')
const autore = ref('')
const testo = ref('')
const frasiUno = ref([])
const frasiDue = ref([])
const frasiTre = ref([])

const accordo = ref('')
const accordi = ref([])

const indice = ref('')
const preferiti = ref([])

const accSelezionato = ref('')
const accSel = ref(null)

const evidenzia = ref(false)
const indiceFrase = ref([])
const pag1 = ref(null)
const pag2 = ref(null)
const pag3 = ref(null)
//const idPag = ref('')

let arrayAcc = ref([])

const container = ref(null)
const testoFormattato = ref(null)
const nota = ref(null)


function elaboraTesto() {
    frasiUno.value = [];
    frasiDue.value = [];
    frasiTre.value = [];
    
    let indiceFineFrase = [0]

    for(let i = 0; i < testo.value.length; i++ ) {
        if(testo.value[i] === "\n") {
            indiceFineFrase.push(i)
        }
    }

    let index = 0;

    indiceFineFrase.forEach( e => {
        let frase = testo.value.slice(e, indiceFineFrase[index + 1])
        index = index + 1;

        if(frasiUno.value.length < 17) {
            frasiUno.value.push(frase)
            //console.log(frasiUno);
        } else if(frasiDue.value.length < 20) {
            frasiDue.value.push(frase)
            //console.log(frasiDue);
        } else{
            frasiTre.value.push(frase)
        }
    })
}

function salva() {
    preferiti.value.push({
        titolo: titolo.value,
        autore: autore.value,
        testo: testo.value
    })
}

watch(preferiti, newVal => {
    localStorage.setItem("preferiti", JSON.stringify(newVal));
}, { deep: true })

watch(preferito, newVal => {
    let brani = localStorage.getItem('preferiti');
    let braniObj = JSON.parse(brani);

    titolo.value = newVal.titoloPref;

    autore.value = braniObj[preferito.index].autore;
    testo.value = braniObj[preferito.index].testo;
})

function getAccordo() {
    if(accordo.value === '') {
        return
    }
    if(!accordi.value.includes(accordo.value)) {
        accordi.value.push(accordo.value)
    }
}

function rimuoviAccordo() {
    let index = accordi.value.indexOf(accSelezionato.value);
    accordi.value.splice(index, 1)
}

function selezionato(e) {
    indice.value = accordi.value.indexOf(e.target.innerText);
    accSelezionato.value = e.target.innerText;
    localStorage.setItem("accordoSelezionato", accSelezionato.value);
}

function elimina(e) {
    e.stopPropagation()    
    if(e.target.className === 'nota') {
        e.target.remove()
    }
}

function evidenziaRit(e) {
    e.target.className = "evidenzia";
}

function resetBold(e) {
    e.target.className = "testo-formattato";
}

function inserisciAccordo(e) {
    let xaxis = e.clientX - (window.innerWidth / 1.8);
    arrayAcc.value.push(`<div class="nota" style="transform: translateX(${xaxis}px)" @contexmenu.prevent="${elimina(e)}">${accSelezionato.value}</div>`);
    e.target.innerHTML = e.target.innerHTML + arrayAcc.value.slice(-1);
}

function exportToPDF() {
    html2pdf(document.getElementById("element-to-convert"), 
    {margin: 10, 
        filename: `${titolo.value}.pdf`, 
        image: {type: 'jpeg', quality: 100}, 
        html2canvas: { scale: 2}, 
        pagebreak: { mode: "css", after: ".pagina"}
    })
}

</script>

<style scoped>
    .pagina-2 {
        margin-top: 30px;
        /* border: solid green 1px; */
    }

    .pagina-3 {
        margin-top: 30px;
        /* border: solid blue 1px; */
    }

    .nota {
        z-index: 20;
    }
    .nota:hover {
        color: red;
    }

    .evidenzia {
        font-weight: bold;
        background: white;
        color: #3e3e3e;
        margin-bottom: 10px
    }

    #app {
        margin-top: 0;
    }
</style>