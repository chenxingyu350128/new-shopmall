<template>
  <div class="page grey lighten-2 pb-11">
    <iHeader @back="$emit('hide')" text="订单详情" />
    <div class="primary white--text px-4 py-2 mb-1 d-flex align-center justify-space-between">
      <div>
        <div>{{orderTopText}}</div>
        <div class="caption mt-1">{{orderTopText_2}}</div>
      </div>
      <v-avatar
        size="55"
        tile
      >
        <img :src="icons[dealStatus-1]">
      </v-avatar>
    </div>
    <!-- 物流信息 -->
    <div class="white pa-2 mb-1 d-flex align-center justify-space-between">
      <v-icon>mdi-map-marker</v-icon>
      <div class="flex-fill caption mx-2">
        <div class="d-flex justify-space-between">
          <span class="nowrap">
            收货人：
            <span class="ml-2">{{consignee}}</span>
          </span>
          <span>{{contactNumber}}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span class="nowrap">收货地址：</span>
          <span class="ml-2">{{region.split('-').join('')}}{{address}}</span>
        </div>
      </div>
      <v-icon>mdi-chevron-right</v-icon>
    </div>
    <div v-if="remark" class="white d-flex pa-2 mb-1">
      <div class="d-flex align-center caption">
        <v-icon size="20">mdi-comment-processing</v-icon>
        <span class="ml-2">买家留言: {{remark}}</span>
      </div>
      <span class="ml-2 flex-fill"></span>
    </div>
    <div v-for="(item, i) in orderGoodsList" :key="i" class="white pa-2 d-flex">
      <v-avatar
        size="65"
        tile
      >
        <img :src="item.goodsImg">
      </v-avatar>
      <div class="ml-2 flex-fill d-flex flex-column justify-space-between">
        <div>{{item.goodsName}}</div>
        <div class="d-flex justify-space-between">
          <span class="primary--text">￥{{item.goodsPrice}}</span>
          <span>X{{item.goodsNum}}</span>
        </div>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="d-flex justify-space-between px-4 py-2 white">
      <span>运费</span>
      <span>{{postagePrice}}</span>
    </div>
    <v-divider></v-divider>
    <div class="d-flex justify-space-between px-4 py-2 white mb-1">
      <span>实付款</span>
      <span>{{totalMoney}}</span>
    </div>
    <div class="px-4 py-2 d-flex align-center white">
      <v-btn depressed x-small color="primary" outlined>积分</v-btn>
      <span class="caption ml-2">
        返积分
        <span class="primary--text">{{backIntegral}}</span>
        点
      </span>
    </div>
    <div class="white mt-1 caption px-4 py-2">
      <div>订单编号： {{orderNum}}</div>
      <div>创建时间： {{createTime}}</div>
      <div v-if="payTime">付款时间： {{payTime}}</div>
      <div v-if="shipTime">发货时间： {{shipTime}}</div>
      <div v-if="completeTime">完成时间： {{completeTime}}</div>
    </div>
    <!-- 底部 -->
    <v-footer fixed bottom class="white">
      <div v-if="dealStatus === 1" class="text-right full-width">
        <v-btn class="ml-2" small color="primary" depressed @click="payOrder">付款</v-btn>
        <v-btn class="ml-2" small color="primary" depressed @click="cancelOrder">取消订单</v-btn>
      </div>
      <div v-if="dealStatus === 2" class="text-right full-width">
        <v-btn class="ml-2" small color="primary" depressed @click="refund">退款</v-btn>
        <v-btn class="ml-2" small color="primary" depressed @click="remind">提醒发货</v-btn>
        <v-btn class="ml-2" small color="primary" depressed @click="cancelOrder">取消订单</v-btn>
      </div>
      <div v-if="dealStatus === 3" class="text-right full-width">
        <v-btn class="ml-2" small color="primary" depressed @click="refund">退款</v-btn>
        <v-btn class="ml-2" small color="primary" depressed @click="confirmGet">确认收货</v-btn>
      </div>
      <div v-if="dealStatus === 4" class="text-right full-width">
        <v-btn small color="primary" depressed @click="review">评价</v-btn>
      </div>
      <div v-if="dealStatus === 5" class="text-right full-width">
        <v-btn small color="primary" depressed @click="deleteOrder">删除订单</v-btn>
      </div>
    </v-footer>
  </div>
</template>

<script>
import iHeader from '@/components/public/header'
export default {
  name: 'orderDetails',
  components: {
    iHeader
  },
  props: {
    orderId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      orderTopText: '',
      orderTopText_2: '',
      dealStatus: 1,
      icons: [
        require('@/assets/img/order_1.png'),
        require('@/assets/img/order_2.png'),
        require('@/assets/img/order_3.png'),
        require('@/assets/img/order_4.png'),
        require('@/assets/img/order_5.png')
      ],
      orderNum: '',
      orderGoodsList: [],
      payMoney: '',
      totalMoney: '',
      postagePrice: '',
      couponPrice: '',
      consignee: '',
      contactNumber: '',
      region: '',
      address: '',
      logisticsNum: '',
      logisticsName: '',
      payTime: '',
      shipTime: '',
      createTime: '',
      completeTime: '',
      remark: '',
      backIntegral: ''
    }
  },

  watch: {
    dealStatus: {
      handler: function (val) {
        switch (val) {
          case 1:
            this.orderTopText = '等待买家付款'
            this.orderTopText_2 = '24小时之内订单关闭'
            break
          case 2:
            this.orderTopText = '买家已付款'
            this.orderTopText_2 = '等待卖家发货'
            break
          case 3:
            this.orderTopText = '卖家已发货'
            this.orderTopText_2 = '买家等待收货'
            break
          case 4:
            this.orderTopText = '交易成功'
            this.orderTopText_2 = '多谢惠顾'
            break
          case 5:
          // case 6:
            this.orderTopText = '交易关闭'
            this.orderTopText_2 = ''
            break
        }
      },
      immediate: true
    }
    //  根据订单类型判断文字
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const params = {
        orderId: this.orderId
      }
      this.$http.get('/order/getOrderByGoods', { params })
        .then(res => {
          if (res.data.success) {
            const obj = res.data.obj
            for (const x in obj) {
              this[x] = obj[x]
            }
          }
        })
    },
    payOrder () {
      this.$emit('payOrder')
    },
    cancelOrder () {
      this.$emit('cancelOrder')
    },
    refund (id, str) {
      this.$emit('refund')
    },
    confirmGet (id, str) {
      this.$emit('confirmGet')
    },
    review (item, str) {
      this.$emit('review')
    },
    remind (id, str) {
      this.$emit('remind')
    },
    deleteOrder (id, str) {
      this.$emit('deleteOrder')
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  position: fixed;
  z-index: 99;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
