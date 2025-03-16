import './assets/main.scss'
import {createPinia} from "pinia";
import { createApp } from 'vue'
import {createPersistedState} from "pinia-persistedstate-plugin";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import router from '@/router'


const persist = createPersistedState()
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
pinia.use(persist)
app.use(ElementPlus)
app.use(router)

app.mount('#app')