<template>
  <div class="page grey lighten-2">
    <div class="topBox mb-1 d-flex flex-column justify-space-between">
      <img src="@/assets/img/bk.jpg">
      <div class="pa-4 d-flex align-end full-width">
        <v-avatar
          size="65"
          color="white"
        >
          <img :src="avatar||defaultAvatar">
        </v-avatar>
        <span class="white--text ml-2 z-index-2">{{userName}}</span>
      </div>
      <div class="py-1 d-flex align-center z-index-2 white--text mb-1">
        <v-spacer></v-spacer>
        <div @click="$router.push('/goodsFollow')" class="d-flex flex-column align-center subtitle-2">
          <span>我的关注</span>
          <span class="font-weight-bold">{{interestCount}}</span>
        </div>
        <v-spacer></v-spacer>
        <v-divider color="#fff" vertical inset></v-divider>
        <v-spacer></v-spacer>
        <div @click="$router.push('/footprint')" class="d-flex flex-column align-center caption">
          <span>我的足迹</span>
          <span class="font-weight-bold">{{footprintCount}}</span>
        </div>
        <v-spacer></v-spacer>
      </div>
    </div>
    <div class="white pa-2 d-flex justify-space-between align-center subtitle-2">
      <div class="d-flex align-center">
        <v-icon color="primary">mdi-clipboard-text-outline</v-icon>
        <span class="font-weight-bold ml-4 body-2">我的订单</span>
      </div>
      <span @click="$router.push('/orderList')" class="d-flex align-center">
        <span class="mr-2">查看全部订单</span>
        <v-icon>mdi-chevron-right</v-icon>
      </span>
    </div>
    <v-divider></v-divider>
    <v-tabs
      v-model="orderType"
      color="grey lighten-1"
      grow
      slider-color="transparent"
      class=" mb-1"
    >
      <v-tab
        v-for="(item,i) in itemList"
        :key="i"
        @click="toOrderList(i)"
        class="d-flex flex-column align-center pa-0"
      >
        <v-icon color="grey darken-1">{{item.icon}}</v-icon>
        <div class="caption grey--text text--darken-1">{{ item.name }}</div>
      </v-tab>
    </v-tabs>
    <div @click="$router.push('/addressList')" class="mb-1 d-flex justify-space-between align-center white">
      <div class="pa-2 d-flex align-center">
        <v-icon size="22" color="primary">mdi-square-edit-outline</v-icon>
        <span class="caption ml-2">收货地址</span>
      </div>
      <v-icon>mdi-chevron-right</v-icon>
    </div>
    <div  @click="$router.push('/couponList')" class="mb-1 d-flex justify-space-between align-center white">
      <div class="pa-2 d-flex align-center">
        <v-icon size="22" color="primary">mdi-square-edit-outline</v-icon>
        <span class="caption ml-2">优惠券</span>
      </div>
      <v-icon>mdi-chevron-right</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      defaultAvatar: require('@/assets/img/avatar.png'),
      tabIndex: 2, // footerTab
      interestCount: 0,
      footprintCount: 0,
      showAddress: false,
      itemList: [
        { name: '待付款', icon: 'mdi-wallet-outline' },
        { name: '待发货', icon: 'mdi-package-variant-closed' },
        { name: '待收货', icon: 'mdi-truck' },
        { name: '待评价', icon: 'mdi-comment-processing-outline' },
        { name: '关闭交易', icon: 'mdi-history' }
      ],
      orderType: undefined
    }
  },
  computed: {
    avatar () {
      return this.$store.state.app.image
    },
    userName () {
      return this.$store.state.app.userName
    },
    token () {
      return this.$store.state.app.token
    }
  },
  mounted () {
    this.$store.commit('BOTTOM_NAV_INDEX', 2)
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (this.userInfo) {
      if (this.userInfo.image) {
        this.avatar = this.userInfo.image
      }
    }
    this.init()
  },
  methods: {
    init () {
      this.$http.get('/user/findGoodsFollowPage', { params: { pageSize: 100 } }).then(res => {
        this.interestCount = res.data.rows.length
        if (res.data.pager.totalPages > res.data.pager.currentPage) {
          this.interestCount += '+'
        }
      })
      this.$http.get('/user/findGoodsTracksPage', { params: { pageSize: 100 } })
        .then(res => {
          this.footprintCount = res.data.rows.length || 0
          if (res.data.pager.totalPages > res.data.pager.currentPage) {
            this.footprintCount += '+'
          }
        })
    },
    myInterest () {
      if (localStorage.getItem('token')) {
        this.$router.push({ path: '/goodsFollow' })
      }
    },
    myFootprint () {
      if (localStorage.getItem('token')) {
        this.$router.push({ path: '/footprint' })
      }
    },
    toOrderList (e) {
      this.$router.push({
        path: '/orderList',
        query: {
          type: e + 1
        }
      })
    },
    coupon () {
      this.$router.push('/coupon')
    }
  }
}
</script>

<style lang="scss" scoped>
  .page{
    height: 100vh;
    overflow: hidden;
    .topBox{
      height: 60vw;
      position: relative;
      z-index: 2;
      >img{
        position: absolute;
        width: 100vw;
        height: 100%;
      }
    }
    .z-index-2{
      z-index: 2;
    }
  }
  /deep/ .v-tabs{
    .v-tab{
      min-width: unset;
    }
    div[role='tablist']{
      .v-slide-group__prev{
        display: none!important;
      }
    }
  }
</style>
