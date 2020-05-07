import Vue from 'vue'
import App from './App.vue'
import router from './router'
import _ from 'lodash'
import store from '@/vuex/store.js'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vant/lib/index.css'
import { DatetimePicker, List, Area, CouponCell, CouponList } from 'vant'
import http from '@/api/api.js' // http请求

Vue.prototype._ = _
Vue.prototype.$http = http
Vue.use(DatetimePicker).use(List).use(Area).use(CouponCell).use(CouponList)
Vue.config.productionTip = false

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

// 重定义sessionStorage.setItem()，用来接收app的数据
sessionStorage.setItem = function (key, newVal) {
  const setItemEvent = new Event('setItemEvent')
  setItemEvent.key = key
  setItemEvent.newVal = newVal
  console.log(key, newVal)

  document.dispatchEvent(setItemEvent)
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')