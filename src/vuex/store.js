// store.js
import Vue from 'vue'
import vuex from 'vuex'

// 头部分类
import app from './modules/app'

Vue.use(vuex)

export default new vuex.Store({
  modules: {
    app
  }
})
