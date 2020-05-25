<template>
  <div
    class="page white"
    :class="{'grey lighten-2': list.length}"
  >
    <iHeader @back="$router.back()" text="我的优惠券" />
    <div v-if="list.length">
      <div class="px-4 py-2 d-flex justify-space-between align-center caption">
        <span>可使用优惠券（{{list.length}}张）</span>
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-help-circle</v-icon>
          使用规则
        </div>
      </div>
      <div v-for="(item, i) in list" :key="i">
        <coupon @selectCoupon="selectCoupon($event)" :goodsIds="goodsIds" :goodsPrice="goodsPrice" class="my-2" :item="item" />
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
    goodsPrice: 0,
    goodsIds: ''
  }),
  computed: {
    list () {
      return this.$store.state.app.couponList
    }
  },
  mounted () {
    const goodsPrice = this.$route.query.goodsPrice
    const goodsIds = this.$route.query.goodsIds
    const fromOrderCertain = this.$route.query.fromOrderCertain
    this.$store.commit('ADDRESS_BACK_FLAG', this.fromOrderCertain)
    if (goodsPrice) {
      this.goodsPrice = Number(goodsPrice)
    }
    if (goodsIds) {
      this.goodsIds = Number(goodsIds)
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
