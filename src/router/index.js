import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue')
    },
    {
      path: '/index',
      name: 'Index',
      component: () => import('../views/index.vue')
    },
    {
      path: '/featuredGoods',
      name: 'featuredGoods', // 精选商品
      component: () => import('../views/featuredGoods.vue')
    },
    {
      path: '/smartDevice', // 智能设备
      name: 'smartDevice',
      component: () => import('../views/smartDevice.vue')
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('../views/search.vue')
    },
    {
      path: '/mine',
      name: 'Mine',
      component: () => import('../views/mine.vue')
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/cart.vue')
    },
    {
      path: '/addressList',
      name: 'addressList',
      component: () => import('../views/addressList.vue')
    },
    {
      path: '/couponList',
      name: 'couponList',
      component: () => import('../views/couponList.vue')
    },
    {
      path: '/goodsDetails',
      name: 'goodsDetails',
      component: () => import('../views/goodsDetails.vue')
    },
    {
      path: '/goodsEvaluated',
      name: 'goodsEvaluated',
      component: () => import('../views/goodsEvaluated.vue')
    },
    {
      path: '/classify',
      name: 'Classify',
      component: () => import('../views/classifyList.vue')
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: () => import('../views/orderList.vue')
    },
    {
      path: '/Evaluation',
      name: 'Evaluation',
      component: () => import('../views/evaluation.vue')
    },
    {
      path: '/pay',
      name: 'Pay',
      component: () => import('../views/payPage.vue')
    },
    // {
    //   path: '/orderType',
    //   name: 'orderType',
    //   component: orderType
    // },
    {
      path: '/certainOrder',
      name: 'certainOrder',
      component: () => import('../views/certainOrder.vue')
    },
    {
      path: '/payResult',
      name: 'payResult',
      component: () => import('../views/payResult.vue')
    },
    {
      path: '/goodsFollow',
      name: 'goodsFollow',
      component: () => import('../views/goodsFollow.vue')
    },
    {
      path: '/footprint',
      name: 'footprint',
      component: () => import('../views/footprint.vue')
    }
  ]
})
