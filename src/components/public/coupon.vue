<template>
  <div class="wrap" @click="selectCoupon">
    <div
      v-if="available"
      class="base-coupons white--text py-2 d-flex"
    >
      <div class="left-side d-flex flex-column align-center">
        <span class="headline font-weight-bold">￥{{ couponMoney }}</span>
        <span class="caption mt-2">满{{ satisfyMoney }}可用</span>
      </div>
      <div class="right-side flex-fill ml-1 pa-2 d-flex flex-column">
        <div class="d-flex align-center justify-space-between">
          <span>{{ couponName }}</span>
          <!-- <v-icon
            v-if="!!available"
            color="white"
          >
            mdi-check-circle
          </v-icon> -->
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
          <!-- <v-icon
            v-if="!!available"
            color="pink lighten-2"
          >
            mdi-check-circle
          </v-icon> -->
        </div>
        <div class="caption mt-2">
          开始时间：{{ startTime }}
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
    }
  },
  data: () => ({
    couponId: 1,
    couponMoney: 150, // 优惠金额
    couponName: '腕表设备专用', // 名称
    couponType: 2, // 优惠劵类型 1满减  2指定商品
    endTime: '2020-05-15 17:02:13', // 优惠劵结束时间
    goodsId: 1,
    instructions: '在指定时间用哦，过期作废', // 使用说明
    quota: 50, // 发放优惠券总数
    satisfyMoney: 500, // 条件金额
    startTime: '2020-04-22 17:02:07', // 优惠劵开始时间
    takeCount: 0, // 已领取优惠劵数量
    usedCount: 0 // 已使用优惠券数量
  }),
  computed: {
    available () {
      const dateNow = Date.now()
      const end = Date.parse(this.endTime)
      const start = Date.parse(this.startTime)
      console.log(dateNow, start, end)
      const dateChecked = start <= dateNow && end >= dateNow
      if (!this.goodsPrice) {
        return dateChecked
      } else {
        const priceChecked = this.goodsPrice >= this.satisfyMoney
        return priceChecked && dateChecked
      }
    }
  },
  mounted () {
    for (const x in this.item) {
      this[x] = this.item[x]
    }
  },
  methods: {
    selectCoupon () {
      if (this.available) {
        this.$emit('selectCoupon', this.item)
      }
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
    background: radial-gradient(circle at right top, transparent 2.5vw,  #F8BBD0 0) top left / calc((100vw - 16px)/4) 51% no-repeat,
      radial-gradient(circle at right bottom, transparent 2.5vw,  #F8BBD0 0) bottom left /calc((100vw - 16px)/4) 51% no-repeat,
      radial-gradient(circle at left top, transparent 2.5vw, #F8BBD0 0) top right /calc((100vw - 16px)/4*3) 51% no-repeat,
      radial-gradient(circle at left bottom, transparent 2.5vw, #F8BBD0 0) bottom right /calc((100vw - 16px)/4*3) 51% no-repeat;
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
    background-image: linear-gradient(to bottom, #F8BBD0 5px, transparent 5px, transparent),
    radial-gradient(2.5vw circle at 5px 2.5vw, transparent 5px, #F8BBD0 5px);
  }

</style>
