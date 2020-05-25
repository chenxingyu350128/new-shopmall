import axios from 'axios'
import store from '@/vuex/store.js'
import router from '../router'
import qs from 'qs'
import vuetifyToast from 'vuetify-toast'
const api = axios.create({
  baseURL: 'http://mall.yinaf.com',
  // baseURL: 'http://192.168.1.99:8080',
  // baseURL: 'http://192.168.1.101:8080/mall',
  // baseURL: '/',
  timeout: 5000
})
// 请求拦截
api.interceptors.request.use(
  function (config) {
    const token = store.state.app.token
    const url = config.url

    const tokenNotNeed = [
      '/goods/getHotGoods',
      '/goods/getCategoryList',
      '/index/getBannerList',
      '/goods/findGoodsPage',
      '/goods/getGoods',
      '/index/getHotSearch',
      '/index/getSearchGoods',
      '/user/login',
      '/goods/getMobileCode',
      '/goods/findGoodsIde',
      '/goods/findGoodsRecommend',
      '/goods/findGoodsCoupon'
    ]
    if (token && !tokenNotNeed.includes(url)) { // 请求不能带token
      config.headers.token = token
    }
    if (config.method === 'post') {
      if (config.url === '/file/fileUpload') {
        config.headers['Content-Type'] = 'multipart/form-data'
      } else {
        config.data = qs.stringify(config.data)
      }
    }
    // 在发送请求之前做些什么
    // 如果有token,添加到请求报文 后台会根据该报文返回status
    // if (store.state.app.token) {
    //   config.headers.token = store.state.app.token
    // }
    store.commit('SET_LOADING', true)
    return config
  },
  function (error) {
    // 对请求错误做些什么
    store.commit('SET_LOADING', false)
    // router.replace({
    //   path: 'login',
    // })
    return Promise.reject(error)
  }
)
// 响应处理,带token
api.interceptors.response.use(
  response => {
    store.commit('SET_LOADING', false)

    // 检测某种状态进行重定向
    if (!response.data.success) {
      vuetifyToast.info(response.data.msg)
      if (response.data.code === '401') {
        store.commit('XHR_401')
        if (router.history.current.name !== 'orderList' && localStorage.getItem('env') !== 'app') { // 防止订单页进商城
          router.replace('/login')
        }
      }
    }
    return response
  },
  error => {
    store.commit('SET_LOADING', false)
    return Promise.resolve(error.response)
  }
)
export default api
