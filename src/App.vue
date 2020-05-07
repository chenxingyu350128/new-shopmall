<template>
  <v-app
    id="app"
    ref="app"
    @click.capture="clicked"
  >
    <v-content>
      <router-view />
      <bottomNav />
      <loading v-if="showLoading" />
    </v-content>
  </v-app>
</template>

<script>
import store from '@/vuex/store.js'
import router from '@/router/index.js'
import bottomNav from '@/components/public/bottomNav'
import loading from '@/components/public/strip-loading'
export default {
  name: 'App',
  components: {
    loading,
    bottomNav
  },
  data () {
    return {
      sessionId: '',
      lTime: new Date().getTime(), // 最后一次点击的时间
      cTime: new Date().getTime(), // 当前时间
      tOut: 3600000 // 超时时间60min
    }
  },
  computed: {
    showLoading () {
      return this.$store.state.app.loading
    },
    token () {
      return this.$store.state.app.token
    },
    env () {
      return this.$store.state.app.env
    }
  },
  updated () {
    if (this.token && this.env === 'app') {
      if (this.cTime - this.lTime < this.tOut) {
        window.setInterval(this.tTime, 1000)
      } else {
        window.clearInterval()
      }
    }
  },
  methods: {
    clicked () {
      if (this.token) {
        if (this.cTime - this.lTime < this.tOut) {
          this.lTime = this.cTime
        }
        this.cTime = new Date().getTime() // 当界面被点击更新点击时间
      } else {
        this.cTime = this.lTime = new Date().getTime() // 当界面被点击更新点击时间
      }
    },
    tTime () {
      if (this.token) {
        this.cTime = new Date().getTime()
        // console.log('当前时间'+this.cTime)
        // console.log('上次时间'+this.lTime)
        // console.log(this.cTime - this.lTime)
        if (this.cTime - this.lTime > this.tOut) {
          // 退出登录
          store.commit('XHR_401')
          // store.commit('USER_INFO', '')
          router.replace('/login')
        }
      }
    }
  }
}
</script>

<style lang="scss">

/deep/.v-carousel__item{
  img{
    width: 100%;
    height: 100%;
  }
}
/deep/ .v-icon.v-icon:after{
  display: none!important;
}
.halfCardImage{
  width: calc((100vw - 16px)/2);
  height: calc((100vw - 16px)/2);
  max-width: 100%;
}
.ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
.full-width{
  width: 100%;
}
.nowrap{
  white-space: nowrap;
}
.v-toast{
  z-index: 99999999;
}
</style>
