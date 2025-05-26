import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import cesiumPlugin from '@/plugins/cesium.js'
import { initIcons } from "@/plugins/icons"
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

initIcons(app)
// 使用 Pinia
app.use(pinia)
app.use(cesiumPlugin)
app.use(ElementPlus)
app.mount('#app')

