import { createApp } from 'vue'
import router from '@/router'
import App from './App.vue'
import {Button, Form, Field, Toast, Icon, Swipe, SwipeCell, SwipeItem, PullRefresh, List, Tab, Tabs, Checkbox, CheckboxGroup, SubmitBar, Stepper, Popup, AddressList, AddressEdit} from 'vant'
import { createPinia } from 'pinia'
import 'lib-flexible/flexible'

import '@/common/style/theme.css'
import 'vant/es/toast/style'
// 初始化 Vue 实例
const app = createApp(App)
// 注册路由
app.use(router)
// 注册组件
app
  .use(Form)
  .use(Field)
  .use(Toast)
  .use(Button)
  .use(Icon)
  .use(Swipe)
  .use(SwipeCell)
  .use(SwipeItem)
  .use(PullRefresh)
  .use(List)
  .use(Tabs)
  .use(Tab)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(Stepper)
  .use(Popup)
  .use(AddressList)
  .use(AddressEdit)


app.use(createPinia())

app.config.globalProperties.$filters = {
  prefix(url) {
    if (url && url.startsWith('http')) {
      return url
    } else {
      url = `http://backend-api-01.newbee.ltd${url}`
      return url
    }
  }
}
// 挂载 Vue 实例
app.mount('#app')
