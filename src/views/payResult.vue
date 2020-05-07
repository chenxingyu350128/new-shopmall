<template>
  <div class="page">
    <iHeader @back="$router.push('/index')" text="支付结果" />
    <h1 class="pay-result text-center">{{type===4?'支付成功':'支付失败'}}</h1>
    <v-footer fixed bottom class="white">
      <v-spacer></v-spacer>
      <v-btn @click="leftBtn" color="primary" depressed>{{type===4?'我的订单':'重新支付'}}</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="rightBtn" color="primary" outlined depressed>{{type===4?'商城首页':'取消订单'}}</v-btn>
      <v-spacer></v-spacer>
    </v-footer>
    <alertBox title="是否确认取消订单？" :show="alertBox" @cancel="showAlert=false" @certain="cancelOrder" />
  </div>
  <!-- <div :class="$style.content">
    <header>
      <span @click="close">
        <img
          src="/@/assets/close.png"
          alt=""
          :class="flag? 'active': '' "
        >
      </span>
      <span>{{ text }}</span>
      <span />
    </header>
    <img
      :src="'/@/assets/order_'+ type + '.png'"
      alt=""
      :class="$style.img"
    >
    <p>{{ text }}</p>
    <div
      v-if="type === 4"
      :class="$style['btn-group']"
    >
      <router-link
        :to="{ path:'/orderList'}"
        replace
      >
        我的订单
      </router-link>
      <router-link
        :to="{ path: '/index'}"
        replace
      >
        商城首页
      </router-link>
    </div>
    <div
      v-if="type === 5"
      :class="$style['btn-group']"
    >
      <a @click="payAgain">重新支付</a>
      <a @click="cancelOrder">取消订单</a>
    </div>
  </div> -->
</template>

<script>
// import payIndex from "../cart/payIndex"
import iHeader from '@/components/public/header'
import alertBox from '@/components/public/alertBox'
export default {
  components: {
    iHeader,
    alertBox
  },
  data () {
    return {
      type: 5,
      orderId: 0,
      showAlert: false
    }
  },
  computed: {
    orderToPay () {
      return this.$store.state.app.orderToPay
    }
  },
  mounted () {
    this.orderId = this.orderToPay.orderId
    if (this.$route.query.type) {
      this.type = Number(this.$route.query.type)
    }
  },
  methods: {
    leftBtn () {
      const pathTo = this.type === 4 ? '/orderList' : '/pay'
      this.$router.push(pathTo)
    },
    rightBtn () {
      if (this.type === 4) {
        this.$router.push('/index')
      } else {
        this.showAlert = true
      }
    },
    async cancelOrder () {
      const data = {
        orderId: this.orderId
      }
      const res = await this.$http.post('/order/cancelOrder', data)
      if (res.data.success) {
        this.$toast.success('订单取消成功')
        this.$router.push('/index')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page{
    height: 100vh;
  }
  .pay-result{
    margin-top: 40vh;
  }
</style>
