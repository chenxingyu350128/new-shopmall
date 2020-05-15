<template>
  <div class="page">
    <iHeader @back="back" text="我的订单" />
    <v-tabs
      v-model="currentIndex"
      color="primary"
      grow
      @change="typeChange"
      height="35"
      slider-color="primary"
    >
      <v-tab v-for="(item, i) in tabList" :key="i">
        <v-divider v-if="i" inset vertical></v-divider>
        <v-spacer></v-spacer>
        {{item}}
        <v-spacer></v-spacer>
      </v-tab>
    </v-tabs>
    <van-list
        class="px-2 py-4 pt-12"
        v-if="list.length"
        :immediate-check="false"
        :finished="allLoaded"
        loading-text="加载中..."
        finished-text="已全部加载完"
        @load="loadBottom"
    >
      <v-card @click="toDetail(item, item.orderId)" v-for="(item, i) in list" :key="i" flat outlined white class="caption mb-2">
        <div class="pa-2">
          <div class="d-flex justify-space-between align-center ">
            <span>订单号：{{item.orderNum}}</span>
            <span class="primary--text">{{item.title}}</span>
          </div>
          <v-divider class="my-1"></v-divider>
          <div class="d-flex" v-for="(itm, idx) in item.orderGoodsList" :key="idx">
            <v-avatar
              size="75"
              tile
            >
              <img :src="itm.goodsImg">
            </v-avatar>
            <div class="flex-fill ml-2">
              <div class="subtitle-2 font-weight-bold">{{itm.goodsName}}</div>
              <div class="subtitle-1 primary--text text-right">{{itm.goodsPrice}}</div>
              <div v-if="itm.skuSpec" class="caption grey--text text--lighten-2">规格：{{itm.skuSpec}}</div>
              <div class="subtitle-1 grey--text text-right">X{{itm.goodsNum}}</div>
            </div>
          </div>
        </div>
        <v-divider></v-divider>
        <div class="pa-2 text-right">共{{item.count}}件商品，合计￥{{item.totalMoney}}(不含运费)</div>
        <div class="pa-2 text-right">
          <v-btn @click.stop="deleteOrder({orderId: item.orderId})" small class="ml-2" v-if="item.dealStatus >= 5" color="primary" depressed>删除订单</v-btn>
          <v-btn @click.stop="payOrder(item)" small class="ml-2" v-if="item.dealStatus===1" color="primary" depressed>付款</v-btn>
          <v-btn @click.stop="remind({orderId: item.orderId})" small class="ml-2" v-if="item.dealStatus===2" color="primary" depressed>提醒发货</v-btn>
          <v-btn @click.stop="confirmGet({orderId: item.orderId})" small class="ml-2" v-if="item.dealStatus===3" color="primary" depressed>确认收货</v-btn>
          <v-btn @click.stop="review({item: item})" small class="ml-2" v-if="item.dealStatus===4" color="primary" depressed>评价</v-btn>
          <v-btn @click.stop="cancelOrder({orderId: item.orderId})" small class="ml-2" v-if="item.dealStatus === 1" color="primary" depressed>取消订单</v-btn>
          <v-btn @click.stop="refund({orderId: item.orderId})" small class="ml-2" v-if="item.dealStatus === 2||item.dealStatus === 3" color="primary" depressed>退款</v-btn>
        </div>
      </v-card>
    </van-list>
    <none class="pt-9" v-else />
    <orderDetails
      v-if="showDetails"
      ref="order"
      :order-id="orderId"
      @payOrder="payOrder()"
      @cancelOrder="cancelOrder($event)"
      @deleteOrder="deleteOrder($event)"
      @refund="refund($event)"
      @review="review($event)"
      @remind="remind($event)"
      @confirmGet="confirmGet($event)"
      @hide="showDetails=false"
    />
    <evaluation
      v-if="showEval"
      @hide="showEval=false"
      @reload="showEval=false;init()"
      :obj="evalObj"
    />
    <alertBox :show="showAlert" @cancel="showAlert=false" :title="alertTitle" @certain="alertCertain" />
  </div>
</template>

<script>
import iHeader from '@/components/public/header'
import alertBox from '@/components/public/alertBox'
import none from '@/components/public/none'
import evaluation from '@/views/evaluation'
import orderDetails from '@/views/orderDetails'

export default {
  name: 'orderList',
  components: {
    iHeader,
    alertBox,
    none,
    orderDetails,
    evaluation
  },
  data () {
    return {
      tabList: ['全部订单', '待付款', '待发货', '待收货', '待评价'],
      currentIndex: 0,
      outside: '',
      currentPage: 1,
      list: [],
      evalObj: null,
      realStatus: 0,
      allLoaded: false,
      pageSize: 10,
      orderNum: '',
      orderId: 0,
      orderObj: null,
      showDetails: false,
      showEval: false,
      showAlert: false,
      alertTitle: '',
      handleText: ''
    }
  },
  computed: {
    token () {
      return this.$store.state.app.token
    },
    origin () {
      return this.$store.state.app.origin
    }
  },
  watch: {
    list () {
      this.list.forEach(res => {
        let title = ''
        switch (res.dealStatus) {
          case 1:
            title = '待付款'
            break
          case 2:
            title = '待发货'
            break
          case 3:
            title = '待收货'
            break
          case 4:
            title = '待评价'
            break
          case 5:
            title = '交易成功'
            break
          case 6:
            title = '交易关闭'
            break
        }
        let count = 0
        res.orderGoodsList.forEach(e => {
          count += e.goodsNum
        })
        this.$set(res, 'count', count)
        this.$set(res, 'title', title)
      })
      return this.list
    }
  },
  mounted () {
    this.currentIndex = Number(this.$route.query.type)
  },
  beforeDestroy () {
    document.removeEventListener('setItemEvent', this.setItemEvent)
  },
  created () {
    this.loadBottom = this._.debounce(this.loadmore, 50)
    document.addEventListener('setItemEvent', this.setItemEvent)
    let sessionId
    let type
    const hasSearch = location.hash.split('?')[1]
    if (hasSearch) {
      const arr = location.hash.split('?')[1].split('&')
      console.log(arr)
      const keyvalue = {}
      for (const x in arr) {
        keyvalue[arr[x].split('=')[0]] = arr[x].split('=')[1]
      }
      if (keyvalue.sessionId) {
        sessionId = keyvalue.sessionId
      }
      if (keyvalue.type) {
        type = keyvalue.type
      }
      const localType = this.$route.query.type
      this.currentIndex = this.realStatus = type ? parseInt(type) : localType ? parseInt(localType) : 0
      if (keyvalue.outside) {
        this.outside = keyvalue.outside
      }
    }
    if (!this.token) {
      // app传sessionId

      if (sessionId) {
        localStorage.setItem('outside', '666')
        this.$store.commit('SET_ORIGIN', 'ORIGIN001')
        this.$store.commit('SET_ENV', 'app')
        const data = {
          origin: this.origin,
          sessionId: sessionId
        }
        this.$http.post('/user/login', data).then(res => {
          if (res.data.code === '2000') {
            this.$store.commit('SET_EACH_USER_INFO', res.data.obj)
            this.singleInit(type)
          }
        })
      }
    } else { // 已经登陆
      // let outside = localStorage.getItem('outside')
      this.init()
    }
    if (this.isWeChat()) { // 微信公众号
      this.$store.commit('SET_ORIGIN', 'ORIGIN002')
      this.$store.commit('SET_ENV', 'weChat')
    }
  },
  // created () {
  //   this.loadBottom = this._.debounce(this.loadmore, 50)
  // },
  methods: {
    isWeChat () {
      const ua = window.navigator.userAgent.toLowerCase()
      return ua.indexOf('micromessenger') > -1
    },
    typeChange () {
      this.currentPage = 1
      this.init()
    },
    back () {
      if (this.outside) {
        // location.href = "goback://"  // 回退到客户端
        const message = { backToApp: true }
        // eslint-disable-next-line no-undef
        webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(message))
      } else {
        this.$router.back()
      }
    },
    toDetail (item, id) {
      this.orderObj = item
      this.orderId = id
      this.showDetails = true
    },
    handle (url, data) { // 操作中转处
      const realUrl = '/order/' + url
      this.$http.post(realUrl, data)
        .then(res => {
          if (res.data.success) {
            this.init()
            this.showDetails = false
            this.$toast.success(res.data.msg)
          }
        })
    },
    alertCertain () {
      this.showAlert = false
      const data = {
        orderId: this.orderId
      }
      this.handle(this.handleText, data)
    },
    cancelOrder (obj) { // 取消订单
      console.log(obj)
      this.orderId = obj ? obj.orderId : this.orderObj.orderId
      this.alertTitle = '确认取消此订单吗?'
      this.handleText = 'cancelOrder'
      this.showAlert = true
    },
    confirmGet (obj) { // 确认收货
      this.orderId = obj ? obj.orderId : this.orderObj.orderId
      this.alertTitle = '确认收货吗?'
      this.handleText = 'confirmGoods'
      this.showAlert = true
    },
    remind (obj) { // 提醒发货
      this.orderId = obj ? obj.orderId : this.orderObj.orderId
      this.alertTitle = '是否提醒发货?'
      this.handleText = 'remind'
      this.showAlert = true
    },
    refund (obj) { // 退款
      this.orderId = obj ? obj.orderId : this.orderObj.orderId
      this.alertTitle = '此订单确认退款吗?'
      this.handleText = 'refund'
      this.showAlert = true
    },
    review (list) { // 商品评价
      this.evalObj = list ? list.item : this.orderObj
      this.showEval = true
      this.showDetails = false
      console.log(list)
      // this.$router.push({name: 'Evaluation',params: {list: JSON.stringify(list), orderId: orderId}})
    },
    deleteOrder (obj) { // 删除订单
      this.orderId = obj ? obj.orderId : this.orderObj.orderId
      this.alertTitle = '确认删除此订单吗?'
      this.handleText = 'deleteOrder'
      this.showAlert = true
    },
    payOrder (item) {
      // 再次支付
      const obj = item || this.orderObj
      this.$store.commit('ORDER_TO_PAY', obj)
      this.$router.push('/pay')
    },
    loadmore () {
      if (this.allLoaded) {
        return
      }
      this.currentPage++
      this.init(true)
    },
    initUnit (data, sign) {
      this.$http.get('/order/findOrderPage', { params: data })
        .then(res => {
          if (res.data.success) {
            const pager = res.data.pager
            const rows = res.data.rows
            this.allLoaded = pager.currentPage === pager.totalPages
            this.list = sign ? this.list.concat(rows) : rows
            this.list.sort((x, y) => {
              const regex = /-/gi
              const xx = Date.parse(x.createTime.replace(regex, '/'))
              const yy = Date.parse(y.createTime.replace(regex, '/'))
              const result = xx - yy
              if (result === 0) {
                return 0
              }
              if (result > 0) {
                return -1
              }
              if (result < 0) {
                return 1
              }
            })
          }
        })
    },
    init (e) {
      const params = ({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      })
      if (this.currentIndex) {
        params.realStatus = this.currentIndex
      }
      if (e) {
        this.initUnit(params, true)
      } else {
        this.initUnit(params)
      }
    },
    singleInit (type) {
      const params = ({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      })
      if (type) {
        params.realStatus = this.currentIndex = this.realStatus = type
      }
      // 加延时，以防外部订单导航直连，token获取不及时
      setTimeout(() => {
        this.initUnit(params)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  padding-top:45px;
  overflow-y: auto;
}
/deep/ .v-tabs{
  z-index: 9;
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  .v-tab{
    min-width: unset;
    padding: 0;
  }
  div[role='tablist']{
    .v-slide-group__prev{
      display: none!important;
    }
  }
}
</style>
