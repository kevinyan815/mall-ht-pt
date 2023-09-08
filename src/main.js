import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import {Button, Form, Field, Toast } from 'vant'
import 'lib-flexible/flexible'


// 初始化 Vue 实例
const app = createApp(App)
// 注册路由
app.use(router)
// 注册组件
app.use(Form).use(Field).use(Toast).use(Button)
// 挂载 Vue 实例
app.mount('#app')