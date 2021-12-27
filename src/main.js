import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import axios from 'axios'

import App from './App.vue'
import router from './router'

axios.defaults.baseURL = 'http://10.28.133.77:8000'

library.add(fas)
const app = createApp(App)
app.use(router).use(ElementPlus).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
app.config.globalProperties.$axios = axios
