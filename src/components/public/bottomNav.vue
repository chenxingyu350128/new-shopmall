<template>
  <v-bottom-navigation
    v-if="active"
    fixed
    height="45"
    grow
    v-model="index"
    class="bottomNav"
    color="primary"
  >
    <!-- v-model="bottomNavIndex" -->
    <v-btn  @click="changeRouter(0)">
      <span>首页</span>
      <v-icon>mdi-home-outline</v-icon>
    </v-btn>

    <v-btn  @click="changeRouter(1)">
      <span>购物车</span>
      <v-icon>mdi-cart</v-icon>
    </v-btn>

    <v-btn  @click="changeRouter(2)">
      <span>我的</span>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data: () => ({
    active: false,
    index: 0,
    tabbarRoutes: [
      '/index',
      '/cart',
      '/mine'
    ]
  }),
  computed: {
    token () {
      return this.$store.state.app.token
    },
    bottomNavIndex () {
      const x = this.$store.state.app.tabbarIndex
      return x
    }
  },
  methods: {
    changeRouter (e) {
      if (!this.token && e) { // 未登录且非首页
        this.$router.push('/login')
        return
      }
      this.$router.push(this.tabbarRoutes[e])
    }
  },
  // 非tabbar页隐藏底部导航栏
  watch: {
    $route: {
      handler: function (val) {
        const routerPath = val.path
        this.active = this.tabbarRoutes.indexOf(routerPath) !== -1
      },
      // 深度观察监听
      deep: true,
      immediate: true
    },
    bottomNavIndex: {
      handler (val) {
        this.index = val
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .bottomNav{
    z-index: 111!important;
    /deep/ .v-btn__content{
      padding: 0;
      justify-content: space-around;
    }
  }
</style>
