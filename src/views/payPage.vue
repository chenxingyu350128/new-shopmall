<template>
  <div class="page">
    <iHeader @back="showAlert=true" text="订单支付" />
    <div class="price-show d-flex">
      <h1 class="text-center full-width my-12">￥{{payMoney}}</h1>
    </div>
    <v-divider></v-divider>
    <div @click="changeWay(1)" class="d-flex justify-space-between align-center pa-2">
      <div class="d-flex align-center">
        <v-icon color="green accent-4">mdi-wechat</v-icon>
        <span class="ml-2">微信</span>
      </div>
      <v-icon :color="payWay===1?'primary':'grey lighten-2'">{{payWay===1?'mdi-check-circle':'mdi-circle-outline'}}</v-icon>
    </div>
    <v-divider></v-divider>
    <div v-if="showZFB" @click="changeWay(2)" class="d-flex justify-space-between align-center pa-2">
      <div class="d-flex align-center">
        <v-avatar
          size="24"
        >
          <img src="@/assets/img/alipay.png">
        </v-avatar>
        <span class="ml-2">支付宝</span>
      </div>
      <v-icon :color="payWay===2?'primary':'grey lighten-2'">{{payWay===2?'mdi-check-circle':'mdi-circle-outline'}}</v-icon>
    </div>
    <v-divider></v-divider>
    <v-footer class="white mt-4">
      <v-btn block @click="debouncePay" color="primary" depressed >确认支付</v-btn>
    </v-footer>
    <v-footer fixed bottom class="white mb-2">
      <span class="footer-title primary--text caption">颐纳福服务， 送给家人的温暖</span>
    </v-footer>
    <alertBox title="是否确认取消支付？" :show="showAlert" @cancel="showAlert=false" @certain="$router.back()" />
  </div>
</template>

<script>
import iHeader from '@/components/public/header.vue'
import alertBox from '@/components/public/alertBox.vue'
export default {
  name: 'PayPage',
  components: {
    alertBox,
    iHeader
  },
  data () {
    return {
      resultType: 5,
      orderNum: 0,
      orderGoodsList: [],
      orderId: 0,
      createTime: '',
      payMoney: 0,
      currentIndex: 1,
      payWay: 1,
      showZFB: true,
      showAlert: false,
      payInfo: null
    }
  },
  computed: {
    orderToPay () {
      return this.$store.state.app.orderToPay
    },
    env () {
      return this.$store.state.app.env
    },
    userName () {
      return this.$store.state.app.userName
    }
  },
  mounted () {
    if (this.env === 'weChat') {
      // 微信内置浏览器
      this.showZFB = false
    }
    for (const x in this.orderToPay) {
      this[x] = this.orderToPay[x]
      this.payWay = 1
    }
  },
  created () {
    this.debouncePay = this._.debounce(this.pay, 30)
    document.addEventListener('setItemEvent', this.setItemEvent)
  },
  methods: {
    pay () {
      if (this.env === 'weChat') { // 微信环境
        const beforeWxPay = {
          userName: this.userName,
          orderNum: this.orderNum
        }
        this.WXPayPre(beforeWxPay)
        return false
      }
      // 非微信环境（app/h5）
      const data = {
        orderNum: this.orderNum,
        payWay: this.payWay
      }
      this.$http.post('/pay/appYinafPay', data)
        .then(res => {
          if (res.data.success) {
            this.payInfo = {
              obj: res.data.obj,
              payway: this.payWay
            }
            if (this.payWay === 1) { // 微信支付，检测微信安装
              const msg = { wxInstalled: 'Yo!' }
              // eslint-disable-next-line no-undef
              webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(msg))
              return
            }
            // 发送数据到给app处理 支付宝
            // eslint-disable-next-line no-undef
            webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(this.payInfo))
          }
        })
    },
    WXPayPre (beforeWxPay) {
      this.$http.post('/pay/wechatPay', beforeWxPay)
        .then(res => {
          if (res.data.success) {
            const data = res.data.obj
            this.onBridgeReady(data)
          }
        })
    },
    onBridgeReady (data) {
      const that = this
      function onBridgeReady () {
        // eslint-disable-next-line no-undef
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', data,
          function (res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              that.resultType = 4
            }
            // 去结果页
            that.$router.push({
              path: '/result',
              query: {
                type: this.resultType
              }
            })
          })
      }
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
      } else {
        onBridgeReady()
      }
    },
    setItemEvent (e) {
      if (e.key === 'wxInstalled') {
        if (e.newVal) {
          window.webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(this.payInfo))
        } else {
          this.$toast.warning('请先安装微信')
        }
        // that.wxInstalled = true
      }
      if (e.key === 'paySucceed') {
        if (e.newVal) {
          this.resultType = 4
          this.$toast.success('支付成功')
        }
        // 去结果页
        this.$router.push({
          path: '/payResult',
          query: { type: this.resultType }
        })
      }
    },
    changeWay (e) {
      console.log(e)
      if (this.payWay !== e) {
        this.payWay = e
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  padding-top: 45px;
}
.footer-title{
  margin: auto;
}
</style>
