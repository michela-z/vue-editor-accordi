<template>
    <div class="editor">
        <!-- <label for="titolo">Inserisci il titolo</label> -->
        <textarea name="titolo" id="titolo" cols="45" rows="1" v-model="titolo" placeholder="Inserisci il titolo"></textarea>

        <!-- <label for="autore">Inserisci l'autore</label> -->
        <textarea name="autore" id="autore" cols="45" rows="1" v-model="autore" placeholder="Inserisci l'autore"></textarea>

        <!-- <label for="testo">Inserisci il testo</label> -->
        <textarea name="testo" id="testo" cols="45" rows="10" v-model="testo" placeholder="Inserisci il testo">{{ testo }}</textarea>

        <div class="pulsanti">
            <button class="pulsante" @click="elaboraTesto"> elabora </button>
            <button class="pulsante" @click="salva">❤</button>
            <button class="pulsante" @click="reset"> reset </button>
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
        <!-- <button @click="mostraNote">mostra note inserite</button> -->
        <!-- <div>
            <button @click="transpose">transpose +</button>
            <button>transpose -</button>
        </div> -->

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

            <div ref="cnt1">
                <div class="pagina-1 pagina">
                    <div class="cnt-acc-frase" v-for="(frase, index) in frasiUno" >
                        <div class="accordi-formattati" @click="inserisciAccordo" :index="index" ref="container"></div>
                        <div ref="accSalvati"></div>
                        <p class="testo-formattato" :index="index" @contextmenu.prevent="evidenziaRit" @click="resetBold">{{ frase }}</p>
                    </div>
                </div>

                <div class="pagina-2 pagina">
                    <div class="cnt-acc-frase" v-for="(frase, index) in frasiDue" >
                        <div class="accordi-formattati" @click="inserisciAccordo" :index="index" ref="container"></div>
                        <p class="testo-formattato" :index="index" @contextmenu.prevent="evidenziaRit" @click="resetBold">{{ frase }}</p>
                    </div>
                </div>

                <div class="pagina-3 pagina">
                    <div class="cnt-acc-frase" v-for="(frase, index) in frasiTre" >
                        <div class="accordi-formattati" @click="inserisciAccordo" :index="index" ref="container"></div>
                        <p class="testo-formattato" :index="index" @contextmenu.prevent="evidenziaRit" @click="resetBold">{{ frase }}</p>
                    </div>
                </div>
            </div>

            <!-- <div ref="cnt2"></div> -->

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
const accTransp = ref([])

const indice = ref('')
const preferiti = ref([])

const accSalvati = ref(null)

const accSelezionato = ref('')
const accSel = ref(null)

const evidenzia = ref(false)
const indiceFrase = ref([])
//const idPag = ref('')

let arrayAcc = ref([])

const container = ref(null)
const testoFormattato = ref(null)
const nota = ref(null)

const cnt1 = ref(null)
//const cnt2 = ref(null)

const testoeaccordi = ref('')

const noteInserite = ref([])

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
    testoeaccordi.value = cnt1.value.innerHTML;

    preferiti.value.push({
        titolo: titolo.value,
        autore: autore.value,
        //testo: testo.value,
        // accordi: arrayAcc.value,
        testoAccordi: testoeaccordi.value,
    })
}

watch(preferiti, newVal => {
    localStorage.setItem("preferiti", JSON.stringify(newVal));
}, { deep: true })

watch(preferito, newVal => {
    console.log('watch');
    let brani = localStorage.getItem('preferiti');
    let braniObj = JSON.parse(brani);

    titolo.value = newVal.titoloPref;
    autore.value = braniObj[preferito.index].autore;
    //testo.value = braniObj[preferito.index].testo;
    testoeaccordi.value = braniObj[preferito.index].testoAccordi;

    //console.log(cnt1.value.innerHTML, testoeaccordi.value);
    //cnt1.value.innerHTML = ''
    //cnt2.value.innerHTML = testoeaccordi.value;

    cnt1.value.innerHTML = testoeaccordi.value;
})

function getAccordo() {
    if(accordo.value === '') {
        return
    }
    if(!accordi.value.includes(accordo.value)) {
        accordi.value.push(accordo.value)
    }
}

function reset() {
    // titolo.value = '';
    // autore.value = '';
    // testo.value = '';

    // frasiUno.value = '';
    // frasiDue.value = '';
    // frasiTre.value = '';

    location.reload()
}

// let note = ['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'sol', 'sol#', 'la', 'la#', 'si']
// let n = 1;

// function transpose() {
//     if(n > 1) {
//         console.log('if');
//         console.log(n);
//         accTransp.value.forEach(a => {
//             console.log('note presa dal contenitore', a)
//             let notaTrasp = note.indexOf(a) + 1;
//             console.log(note.at(notaTrasp));
//             accTransp.value = []
//             accTransp.value.push(note.at(notaTrasp))
//         })
//     } else {
//         console.log('else');
//         console.log(n);
//         accordi.value.forEach(a => {
//             console.log('note presa dal contenitore', a)
//             let notaTrasp = note.indexOf(a) + 1;
//             console.log(note.at(notaTrasp));
//             accordi.value = []
//             accTransp.value.push(note.at(notaTrasp))
//         })
//     }
//     n++
// }

function mostraNote() {
    console.log(note);
}

function rimuoviAccordo() {
    let index = accordi.value.indexOf(accSelezionato.value);
    accordi.value.splice(index, 1)

    // let index2 = accTransp.value.indexOf(accSelezionato.value);
    // accTransp.value.splice(index2, 1)
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

    // mettere note all'interno di un array per trasporre direttamente le note sul testo, ma devo mdoficare l'innerHtml, è un bordello
    // noteInserite.value.push(accSelezionato.value)
    // console.log(noteInserite.value);
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