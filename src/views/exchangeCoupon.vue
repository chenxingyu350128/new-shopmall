<template>
  <div
    class="page white px-4"
    :class="{'grey lighten-2': history.length}"
  >
    <iHeader @back="$emit('hide')" text="兑换优惠券" />
    <v-text-field
      outlined
      height="35"
      class="pt-4"
      dense
      v-model="exCode"
      placeholder="请输入兑换码"
    ></v-text-field>
    <v-btn @click="exChange" block color="primary" rounded dark depressed>兑换</v-btn>
    <div class="d-flex align-center my-4">
      <v-divider></v-divider>
      <span class="mx-4 grey--text subtitle-2">已兑换优惠券</span>
      <v-divider></v-divider>
    </div>
    <div v-if="history.length">
      <div v-for="(item, i) in history" :key="i" class="white pa-2">
        <div class="d-flex bottom-border-dashed">
          <div class="left flex-fill">
            <div class="subtitle-1">{{item.couponName}}</div>
            <div class="subtitle-2 pb-2">满{{item.satisfyMoney}}减{{item.couponMoney}}可使用</div>
          </div>
          <div class="right px-2 primary--text subtitle-1 d-flex align-center left-border-dashed">
            ￥{{item.couponMoney}}
          </div>
        </div>
        <div class="caption py-2">有效期：{{item.startTime.split(' ')[0]}} - {{item.endTime.split(' ')[0]}}</div>
        <div class="caption py-2 d-flex align-center justify-space-between">
          <div class="d-flex align-center caption">
            <span>限制使用说明</span>
            <v-icon @click="toggle(item)">{{item.checked?'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
          </div>
          <v-btn depressed rounded small>去使用</v-btn>
        </div>
        <div v-if="item.checked" class="caption primary--text">{{item.instructions}}</div>
      </div>
    </div>
    <none v-else />
  </div>
</template>

<script>
import iHeader from '@/components/public/header.vue'
import none from '@/components/public/none.vue'

export default {
  name: 'exchangeCoupon',
  components: {
    iHeader,
    none
  },
  data: () => ({
    exCode: '',
    history: [
      {
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
      }
    ]
  }),
  mounted () {
    this.getHistory()
  },
  methods: {
    async getHistory () {
      const res = await this.$http.get('/user/findConvertHistory')
      if (res.data.success) {
        const list = res.data.obj || []
        this.history = list
        this.history.forEach(res => {
          this.$set(res, 'checked', false)
        })
      }
    },
    toggle (item) {
      item.checked = !item.checked
    },
    async exChange () {
      if (this.exCode) {
        const data = {
          couponNum: this.exCode
        }
        const res = await this.$http.post('/user/convertCoupon', data)
        if (res.data.success) {
          this.$toast.success('恭喜您，优惠劵领取成功！')
          this.$emit('exchangeSuccess')
        }
      }
    }
  }

}
</script>

<style>
.page{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 6;
}
.left-border-dashed{
  border-left: 1px dashed #ccc;
}
.bottom-border-dashed{
  border-bottom: 1px dashed #ccc;
}
</style>
