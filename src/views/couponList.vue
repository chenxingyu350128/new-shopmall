<template>
  <div
    class="page white"
    :class="{'grey lighten-2': list.length}"
  >
    <iHeader @back="$router.back()" text="我的优惠券" />
    <div v-if="list.length">
      <div class="px-4 py-2 d-flex justify-space-between align-center caption">
        <span>可使用优惠券（{{}}张）</span>
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-help-circle</v-icon>
          使用规则
        </div>
      </div>
      <div v-for="(item, i) in list" :key="i">
        <coupon @selectCoupon="selectCoupon($event)" :goodsPrice="goodsPrice" class="my-2" :item="item" />
      </div>
    </div>
    <none v-else />
    <v-footer fixed bottom class="transparent align-center justify-center pa-0">
      <v-btn @click="showExchange=true" color="primary" large depressed>
        <v-icon>mdi-plus</v-icon> 兑换优惠券
      </v-btn>
    </v-footer>
    <exchangeCoupon v-if="showExchange" @exchangeSuccess="exchangeSuccess" @hide="showExchange=false" />
  </div>
</template>

<script>
import iHeader from '@/components/public/header.vue'
import none from '@/components/public/none'
import coupon from '@/components/public/coupon'
import exchangeCoupon from '@/views/exchangeCoupon'

export default {
  components: {
    iHeader,
    none,
    coupon,
    exchangeCoupon
  },
  data: () => ({
    page: 1,
    rows: 10,
    allLoaded: false,
    showExchange: false,
    fromOrderCertain: false,
    goodsPrice: 0
  }),
  computed: {
    list () {
      return this.$store.state.app.couponList
      // return [
      //   {
      //     couponId: 1,
      //     couponMoney: 150, // 优惠金额
      //     couponName: '腕表设备专用', // 名称
      //     couponType: 2, // 优惠劵类型 1满减  2指定商品
      //     endTime: '2020-05-15 17:02:13', // 优惠劵结束时间
      //     goodsId: 1,
      //     instructions: '在指定时间用哦，过期作废', // 使用说明
      //     quota: 50, // 发放优惠券总数
      //     satisfyMoney: 500, // 条件金额
      //     startTime: '2020-04-22 17:02:07', // 优惠劵开始时间
      //     takeCount: 0, // 已领取优惠劵数量
      //     usedCount: 0 // 已使用优惠券数量
      //   },
      //   {
      //     couponId: 2,
      //     couponMoney: 35, // 优惠金额
      //     couponName: '腕表x设备专用', // 名称
      //     couponType: 2, // 优惠劵类型 1满减  2指定商品
      //     endTime: '2020-05-15 17:02:13', // 优惠劵结束时间
      //     goodsId: 1,
      //     instructions: '在指定时间用哦，过期作废', // 使用说明
      //     quota: 50, // 发放优惠券总数
      //     satisfyMoney: 150, // 条件金额
      //     startTime: '2020-04-21 17:02:07', // 优惠劵开始时间
      //     takeCount: 0, // 已领取优惠劵数量
      //     usedCount: 0 // 已使用优惠券数量
      //   }
      // ]
    }
  },
  mounted () {
    const goodsPrice = this.$route.query.goodsPrice
    const fromOrderCertain = this.$route.query.fromOrderCertain
    this.$store.commit('ADDRESS_BACK_FLAG', this.fromOrderCertain)
    if (goodsPrice) {
      this.goodsPrice = Number(goodsPrice)
    }
    if (fromOrderCertain) {
      this.fromOrderCertain = fromOrderCertain
    }
    this.getList()
  },
  methods: {
    back () {
      this.$router.back()
    },
    async getList (e) {
      const params = {
        currentPage: this.page,
        pageSize: this.rows
      }
      const res = await this.$http.get('/user/findCouponPage', { params })
      if (res.data.success) {
        const pager = res.data.pager
        const rows = res.data.rows
        this.allLoaded = pager.currentPage === pager.totalPages
        const list = e ? this.list.concat(rows) : rows
        this.$store.commit('SET_COUPON_LIST', list)
      }
    },
    selectCoupon (e) {
      console.log(e)
      if (this.fromOrderCertain) {
        this.$store.commit('SELECT_COUPON_FOR_ORDER', e)
        this.$router.back()
      }
    },
    exchangeSuccess () {
      this.showExchange = false
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  padding-top: 45px;
  height: 100vh;
  overflow-y: auto;
}
</style>
