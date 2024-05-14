import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Salvati from '../views/Salvati.vue'

const routes = [
    {path: '/', name: 'Home', component: Home},
    {path: '/salvati', name: 'Salvati', component: Salvati}
]

const router = createRouter( {
    history: createWebHistory(),
    routes,
    linkActiveClass: "active",
})

export default router 
