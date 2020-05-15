<template>
  <div class="wrap">
    <div
      v-if="available"
      @click="selectCoupon"
      class="base-coupons white--text py-2 d-flex"
    >
      <div class="left-side d-flex flex-column align-center">
        <span class="headline font-weight-bold">￥{{ couponMoney }}</span>
        <span class="caption mt-2">满{{ satisfyMoney }}可用</span>
      </div>
      <div class="right-side flex-fill ml-1 pa-2 d-flex flex-column">
        <div class="d-flex align-center justify-space-between">
          <span>{{ couponName }}</span>
          <v-btn v-if="alreadyGet" color="grey lighten-3">已领取</v-btn>
        </div>
        <div class="caption mt-2">
          有效期：{{ startTime.split(' ')[0] }} - {{ endTime.split(' ')[0] }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="disable-coupons white--text py-2 d-flex"
    >
      <div class="left-side d-flex flex-column align-center">
        <span class="headline font-weight-bold">￥{{ couponMoney }}</span>
        <span class="caption mt-2">满{{ satisfyMoney }}可用</span>
      </div>
      <div class="right-side flex-fill ml-1 pa-2 d-flex flex-column">
        <div class="d-flex align-center justify-space-between">
          <span>{{ couponName }}</span>
          <v-btn v-if="alreadyGet" small dark depressed color="grey lighten-3">已领取</v-btn>
        </div>
        <div class="caption mt-2">
            有效期：{{ startTime.split(' ')[0] }} - {{ endTime.split(' ')[0] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CouponCpnt',
  props: {
    item: {
      type: Object,
      required: true
    },
    goodsPrice: {
      type: Number,
      required: false,
      default: 0
    },
    goodsIds: {
      type: String,
      required: false,
      default: ''
    }
  },
  data: () => ({
    couponId: 1,
    couponMoney: 150, // 优惠金额
    couponName: '腕表设备专用', // 名称
    couponType: 2, // 优惠劵类型 1满减  2指定商品
    endTime: '', // 优惠劵结束时间
    goodsId: 1,
    instructions: '在指定时间用哦，过期作废', // 使用说明
    quota: 50, // 发放优惠券总数
    satisfyMoney: 500, // 条件金额
    startTime: '', // 优惠劵开始时间
    takeCount: 0, // 已领取优惠劵数量
    usedCount: 0, // 已使用优惠券数量
    alreadyGet: false // 商品详情页 是否已领取
  }),
  computed: {
    available () {
      const dateNow = Date.now()
      const regex = /-/gi
      const end = Date.parse(this.endTime.replace(regex, '/'))
      const start = Date.parse(this.startTime.replace(regex, '/'))
      const dateChecked = start <= dateNow && end >= dateNow
      const priceChecked = this.goodsPrice >= this.satisfyMoney

      if (this.goodsId) { // 日期和价格为必要
        // 专属券
        const idYes = this.goodsId.toString() === this.goodsIds.toString()
        return priceChecked && dateChecked && idYes && !this.alreadyGet
      } else {
        return priceChecked && dateChecked && !this.alreadyGet
      }
    }
  },
  watch: {
    item: {
      handler (val) {
        console.log(val)
        if (val) {
          this.alreadyGet = val.alreadyGet
        }
        // for (const x in val) {
        //   this[x] = val[x]
        // }
      },
      immediate: true,
      deep: true
    }
  },
  updated () {
    for (const x in this.item) {
      this[x] = this.item[x]
    }
  },
  mounted () {
    for (const x in this.item) {
      this[x] = this.item[x]
    }
  },
  methods: {
    selectCoupon () {
      this.$emit('selectCoupon', this.item)
    }
  }
}
</script>

<style scoped lang="scss">

  .base-coupons {
    width: calc(100vw - 16px);
    margin: auto;
    height: 25vw;
    position: relative;
    background: radial-gradient(circle at right top, transparent 2.5vw,  #e3393c 0) top left / calc((100vw - 16px)/4) 51% no-repeat,
      radial-gradient(circle at right bottom, transparent 2.5vw,  #e3393c 0) bottom left /calc((100vw - 16px)/4) 51% no-repeat,
      radial-gradient(circle at left top, transparent 2.5vw, #e3393c 0) top right /calc((100vw - 16px)/4*3) 51% no-repeat,
      radial-gradient(circle at left bottom, transparent 2.5vw, #e3393c 0) bottom right /calc((100vw - 16px)/4*3) 51% no-repeat;
    filter: drop-shadow(3px 3px 3px rgba(0,0,0,.3));
    .left-side{
      width: calc((100vw - 16px)/4);
    }
  }
  .disable-coupons {
    width: calc(100vw - 16px);
    height: 25vw;
    margin: auto;
    position: relative;
    background: radial-gradient(circle at right top, transparent 2.5vw,  #ccc 0) top left / calc((100vw - 16px)/4) 51% no-repeat,
      radial-gradient(circle at right bottom, transparent 2.5vw,  #ccc 0) bottom left /calc((100vw - 16px)/4) 51% no-repeat,
      radial-gradient(circle at left top, transparent 2.5vw, #ccc 0) top right /calc((100vw - 16px)/4*3) 51% no-repeat,
      radial-gradient(circle at left bottom, transparent 2.5vw, #ccc 0) bottom right /calc((100vw - 16px)/4*3) 51% no-repeat;
    filter: drop-shadow(3px 3px 3px rgba(0,0,0,.3));
    .left-side{
      width: calc((100vw - 16px)/4);
    }
  }
  .base-coupons::before,
  .disable-coupons::before {
    content: '';
    height: calc(100% - 5vw);
    border: 1px dashed #fff;
    position: absolute;
    left: calc((100vw - 16px)/4);
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .base-coupons::after,
  .disable-coupons::after {
    content: '';
    position: absolute;
    height: 100%;
    width:5px;
    top: 0;
    right: -5px;
    background-image: linear-gradient(to bottom, #ccc 5px, transparent 5px, transparent),
    radial-gradient(2.5vw circle at 5px 2.5vw, transparent 5px, #ccc 5px);
    background-size: 5px 15px;
  }
  .base-coupons::after{
    background-image: linear-gradient(to bottom, #e3393c 5px, transparent 5px, transparent),
    radial-gradient(2.5vw circle at 5px 2.5vw, transparent 5px, #e3393c 5px);
  }

</style>
