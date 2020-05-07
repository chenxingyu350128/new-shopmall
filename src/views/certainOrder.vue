<template>
  <div class="page grey lighten-2">
    <iHeader @back="$router.back()" text="订单确认" />
    <div v-if="!token">
      <v-subheader class="d-block caption white my-2 py-1">
        已有颐纳福商城账号，请 <v-btn @click="toLogin" color="primary" dark x-small depressed>登录</v-btn> 后结算，没有账号用户可在本页进行快捷下单
      </v-subheader>
      <div class="white my-2 subtitle-2 pa-4">
        <v-text-field
          class="body-2 pa-0"
          prefix="收货人"
          color="primary"
          placeholder="请输入收件人"
          v-model="receiver"
        ></v-text-field>
        <v-text-field
          class="body-2 pa-0"
          prefix="手机号码"
          color="primary"
          type="number"
          placeholder="请输入手机号码"
          v-model="phone"
        ></v-text-field>
        <v-text-field
          class="body-2 pa-0"
          prefix="所在地区"
          color="primary"
          readonly
          @focus="regionSelect"
          placeholder="请选择所在地区"
          v-model="region"
          append-icon="mdi-chevron-right"
        ></v-text-field>
        <v-textarea
          class="subtitle-2"
          label="详细地址："
          filled
          v-model="addressToFill"
          placeholder="请输入具体的地址"
        ></v-textarea>
        <p class="mb-0 py-2">
          快捷验证
        </p>
        <v-text-field
          class="body-2 pa-0"
          prepend-inner-icon="mdi-cellphone-iphone"
          color="primary"
          type="number"
          placeholder="请输入手机号"
          v-model="userName"
        ></v-text-field>
        <v-text-field
          class="body-2 pa-0"
          prepend-inner-icon="mdi-lock-open-outline"
          color="primary"
          type="number"
          placeholder="请输入图片中的验证码"
          v-model="imgCode"
        >
          <template v-slot:append>
            <s-identify @click.native.stop="getRandomNumber" :identifyCode="identifyCode"></s-identify>
          </template>
        </v-text-field>
        <v-text-field
          class="body-2 pa-0"
          prepend-inner-icon="mdi-lock-open-outline"
          color="primary"
          type="number"
          placeholder="请输入短信验证码"
          v-model="code"
        >
          <template v-slot:append>
            <v-btn @click="getMsgCode" color="primary" x-small rounded dark depressed >获取验证码</v-btn>
          </template>
        </v-text-field>
      </div>
      <div class="white my-2 pa-2 subtitle-2">
        <span>
          商品金额
          <span class="ml-2 overline">（请保存信息获取商品金额）</span>
        </span>
        <div class="px-12 mt-2">
          <v-btn @click="saveInfo" color="primary" block dark depressed>保存信息</v-btn>
        </div>
      </div>
    </div>
    <!-- 以上为未登录状态的页面 -->
    <div v-else class="pb-11">
      <!-- 收货地址 -->
      <div v-if="address" @click="toAddressList" class="white px-2 py-4 d-flex align-center justify-space-between">
        <v-icon large>mdi-map-marker</v-icon>
        <div class="flex-fill mx-2 d-flex flex-column">
          <div class="subtitle-2 mb-1 font-weight-bold d-flex justify-space-between">
            <span class="nowrap">收货人：<span class="ml-2">{{address.receiver}}</span></span>
            <span>{{address.phone}}</span>
          </div>
          <div class="d-flex caption">
            <span class="nowrap">收货地址:</span>
            <span class="flex-fill ml-2">
              {{address.region.split('-').join('')}}
              {{address.address}}
            </span>
          </div>
        </div>
        <v-icon large>mdi-chevron-right</v-icon>
      </div>
      <div v-else @click="toAddressList" class="white px-2 py-4 d-flex align-center justify-center">
        <v-btn color="primary" dark depressed outlined>
          <v-icon>mdi-plus</v-icon>
          添加收货地址
        </v-btn>
      </div>
      <!-- 商品展示 -->
      <div v-if="goodsList.length" class="pa-2">
        <div v-for="(item, i) in goodsList" :key="i" class="white d-flex pa-2 goodsList">
          <v-avatar
            size="75"
            tile
          >
            <img :src="item.goodsCoverImg">
          </v-avatar>
          <div class="ml-2 flex-fill d-flex flex-column justify-space-between">
            <div class="subtitle-2">
              <p class="mb-0">{{item.goodsName}}</p>
              <span class="caption text--secondary">{{item.goodsName}}</span>
            </div>
            <div class="d-flex justify-space-between align-end subtitle-1 font-weight-bold">
              <span class="primary--text">￥{{item.mallPrice}}</span>
              <span>x{{item.goodsNum}}</span>
            </div>
          </div>
        </div>
      </div>
      <div @click="toCouponList" class="my-1 white pa-4 caption d-flex justify-space-between">
        <span>优惠券：</span>
        <span v-if="coupon" class="primary--text">{{coupon.couponName}}</span>
        <span v-else class="grey--text text-lighten-2">无可用优惠券</span>
      </div>
      <v-textarea
        class="white subtitle-2 border-radius-0 my-1"
        solo
        flat
        tile
        dense
        auto-grow
        rows="1"
        v-model="remark"
        prefix="买家留言："
      ></v-textarea>
      <div class="white px-4 py-2 subtitle-2">
        <div class="my-2 d-flex justify-space-between">
          <span>商品金额</span>
          <span>￥{{totalPrice}}</span>
        </div>
        <div class="my-2 d-flex justify-space-between">
          <span>运费</span>
          <span>+￥{{totalPostagePrice}}</span>
        </div>
        <div class="my-2 d-flex justify-space-between">
          <span>优惠券</span>
          <span>-￥{{coupon?coupon.couponMoney:0}}</span>
        </div>
        <div class="text-right font-weight-bold">
          <span>共{{totalNum}}件商品</span>
          <span class="ml-4">
            小计
            <span class="primary--text">￥{{finalPay}}</span>
          </span>
        </div>
      </div>
      <div class="white pa-2 my-1 d-flex align-center subtitle-2">
        <v-btn depressed x-small color="primary" dark outlined rounded>积分</v-btn>
        <span class="ml-4">返积分<span class="primary--text">{{Number(finalPay)}}</span>点</span>
      </div>
      <v-footer fixed bottom class="white pa-0">
        <div class="flex-fill px-2 py-1 subtitle-1 font-weight-bold">
          合计:
          <span class="ml-2 primary--text">￥{{finalPay}}</span>
        </div>
        <v-btn @click="submitOrder" color="primary" depressed tile large dark>提交订单</v-btn>
      </v-footer>
    </div>
    <regionPicker :show="showRegionPicker" @cancel="showRegionPicker=false" @confirm="regionConfirm($event)" />
    <v-bottom-sheet mandatory v-model="showMembers">
      <div class="white">
        <div class="pa-2 d-flex justify-space-between caption">
          <span @click="showMembers=false">取消</span>
          <span class="subtitle-2">选择服务成员</span>
          <span @click="memberConfirm">确认</span>
        </div>
        <v-divider></v-divider>
        <div @click="preGetMember(item)" v-for="(item, i) in memberList" :key="i" class="d-flex pa-4 align-center justify-space-between">
          <span>{{item.real_name}}</span>
          <v-icon :color="item.checked?'primary':'grey lighten-3'">{{item.checked?'mdi-check-circle':'mdi-circle-outline'}}</v-icon>
        </div>
      </div>
    </v-bottom-sheet>
  </div>

</template>

<script>
import iHeader from '@/components/public/header.vue'
import regionPicker from '@/components/public/regionPicker.vue'
import SIdentify from '@/components/public/vertifyCode'

export default {
  name: 'certainOrder',
  components: {
    iHeader,
    regionPicker,
    SIdentify
  },
  data () {
    return {
      identifyCode: '', // 图片数字验证码
      showRegionPicker: false, // 地区选择器
      showCouponList: false, // 优惠券页面开关
      receiver: '',
      phone: '',
      region: '',
      addressToFill: '', // 防止与this.getOrderConfirm()返回的字段命名冲突
      // 快捷注册
      userName: '',
      code: '',
      imgCode: '',
      sendCode: false, // 短信验证码是否已发送
      registerPhone: '', // 发送过短信验证码的手机号，防止用户再次注册且未完成注册引发的意外
      address: null,
      memberList: [],
      coupon: null,
      goodsList: [],
      totalNum: 0,
      totalPrice: 0,
      totalPostagePrice: 0,
      remark: '',
      showMembers: false
    }
  },
  computed: {
    orderConfirmData () {
      return this.$store.state.app.orderConfirmData
    },
    newAddressData () {
      return this.$store.state.app.newAddressData
    },
    token () {
      return this.$store.state.app.token
    },
    origin () {
      return this.$store.state.app.origin
    },
    env () {
      return this.$store.state.app.env
    },
    finalPay () {
      const coupon = Number(this.coupon ? this.coupon.couponMoney : 0)
      const res = Number(this.totalPrice) + Number(this.totalPostagePrice) - coupon
      return res.toFixed(2)
    },
    newCoupon () {
      return this.$store.state.app.newCoupon
    },
    newAddress () {
      return this.$store.state.app.newAddress
    },
    isServiceGoods () {
      return this.goodsList.length === 1 && this.goodsList[0].goodsType === 2
    }
  },
  watch: {
    addressList: {
      handler (newVal) {
        this.addressList = newVal
      },
      deep: true,
      immediate: true
    },
    goodsNum: {
      handler (newVal) {
        this.goodsNum = newVal
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    document.addEventListener('setItemEvent', this.setItemEvent)
  },
  beforeDestroy () {
    document.removeEventListener('setItemEvent', this.setItemEvent)
  },
  mounted () {
    console.log(this.$route.params)
    // 初始化
    this.goodsId = this.$route.params.goodsId
    this.skuGroupids = this.$route.params.skuGroupIds
    this.goodsNum = this.$route.params.goodsNum
    if (this.token) {
      this.getOrderConfirm()
    } else {
      // 获取随机4位数的图片验证码
      this.getRandomNumber()
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    toCouponList () {
      this.$router.push({
        path: '/couponList',
        query: {
          fromOrderCertain: true,
          goodsPrice: this.finalPay
        }
      })
    },
    toAddressList () {
      this.$router.push({
        path: '/addressList',
        query: {
          fromOrderCertain: true
        }
      })
    },
    memberConfirm () {
      if (!this.serviceMember) {
        this.$toast('请选择服务成员', {
          y: 'top',
          color: 'warning'
        })
        return false
      }
      this.showMembers = false
      this.memberId = this.serviceMember.member_id
      this.submitOrder()
    },
    preGetMember (e) {
      this.serviceMember = e
      e.checked = !e.checked
    },
    getRandomNumber () {
      console.log('kkk')
      const base = Math.random().toFixed(4)
      this.identifyCode = base.split('.')[1]
    },
    checkPhone (e) {
      return /^1[3456789]\d{9}$/.test(e)
    },
    getMsgCode () {
      let vertify = true
      const vertifyArr = [
        {
          state: this.imgCode !== this.identifyCode,
          tip: '图片数字验证码不匹配, 请重试'
        },
        {
          state: !this.userName,
          tip: '请输入快捷验证的手机号'
        },
        {
          state: !this.checkPhone(this.userName),
          tip: '手机号格式错误, 请重试'
        }
      ]
      vertifyArr.some(res => {
        if (res.state) {
          vertify = false
          this.$toast(res.tip, {
            y: 'top',
            color: 'warning'
          })
          return true
        }
      })
      if (!vertify) {
        return false
      }
      this.getVerifyCode()
    },
    getVerifyCode () {
      const params = {
        phone: this.userName
      }
      this.$http.get('/goods/getMobileCode', { params })
        .then(res => {
          if (res.data.success) {
            this.$toast('验证码发送成功')
            this.registerPhone = this.userName // 发送过短信验证码的手机号，防止用户再次注册且未完成注册引发的意外
            this.sendCode = true // 表示验证码已发送，即手机号码没问题
            // 更改图片验证码，防止恶意注册
            this.getRandomNumber()
          }
        })
    },
    saveInfo () {
      // 静默登陆前对收货地址做表单验证
      let newAddressDataInvalid = false
      const addressArr = [
        {
          state: !this.receiver,
          tip: '请输入您的称呼'
        },
        {
          state: !this.phone,
          tip: '请输入您的手机号码'
        },
        {
          state: !this.checkPhone(this.phone),
          tip: '收件手机号码格式有误，请重试'
        },
        {
          state: !this.region,
          tip: '请选择您所在的地区'
        },
        {
          state: !this.addressToFill,
          tip: '请填写您的详细地址'
        }
      ]
      addressArr.some(res => {
        if (res.state) {
          this.$toast('收货地址未填写完，\n' + res.tip, {
            y: 'top',
            color: 'warning'
          })
          newAddressDataInvalid = true
          return true
        }
      })
      if (newAddressDataInvalid) {
        return false
      }
      // 收货地址做表单验证通过

      // 对快捷验证做表单验证
      if (!this.sendCode) {
        this.$toast('请先填写上方快捷验证所需的信息', {
          y: 'top',
          color: 'warning'
        })
        return false
      }

      if (!this.code) {
        this.$toast('请输入短信验证码', {
          y: 'top',
          color: 'warning'
        })
        return false
      }
      const data = {
        receiver: this.receiver,
        phone: this.phone,
        region: this.region,
        address: this.addressToFill
      }
      // 把新建收货地址数据存起来，登陆成功后再去操作
      this.$store.commit('NEW_BUILD_ADDRESS', data)
      this.silentLogin()
    },
    async silentLogin () {
      const data = {
        origin: this.origin,
        userName: this.registerPhone,
        code: this.code
      }
      const res = await this.$http.post('/user/login', data)
      if (res.data.success) {
        this.$store.commit('SET_EACH_USER_INFO', res.data.obj)
        this.buildNewAddress()
      }
    },
    async buildNewAddress () {
      await this.$http.post('/user/addAddress', this.newAddressData)
    },
    regionConfirm (e) {
      this.showRegionPicker = false
      const regionArr = e.map(res => res.name)
      this.region = regionArr.join('-')
    },
    regionSelect () {
      this.showRegionPicker = true
    },
    toLogin () {
      this.$router.push({
        path: '/login',
        query: {
          fromOrderCertain: true
        }
      })
    },
    submitOrder () {
      // 区分服务商品，服务商品不能放购物车，所以this.goodsList.length>1时为普通商品

      // 先做表单验证
      if (!this.address) {
        this.$toast('请选择收货地址', {
          y: 'top',
          color: 'warning'
        })
        return false
      }
      const { goodsIds, skuGroupIds } = this.orderConfirmData
      const goodsNums = this.orderConfirmData.goodsNum
      const data = {
        goodsIds,
        skuGroupIds,
        goodsNums,
        // ...this.orderConfirmData,
        consignee: this.address.receiver,
        contactNumber: this.address.phone,
        region: this.address.region,
        address: this.address.address,
        origin: Number(this.origin.split('').pop()),
        remark: this.remark
      }
      if (this.isServiceGoods) { // 服务商品
        if (!this.memberId) {
          this.showMembers = true
          return
        } else {
          data.memberId = this.memberId
        }
      }
      this.orderCommit(data)
    },
    async orderCommit (data) {
      const res = await this.$http.post('/order/addOrderSubmit', data)
      if (res.data.success) {
        const obj = res.data.obj
        this.$store.commit('ORDER_TO_PAY', obj)
        this.$router.push('/pay')
        console.log(obj)
      }
    },
    async getOrderConfirm () {
      // 订单确认数据加载
      const res = await this.$http.post('/order/getOrderConfirm', this.orderConfirmData)
      if (res.data.success) {
        const obj = res.data.obj
        for (const x in obj) {
          this[x] = obj[x]
        }
        let totalPrice = 0
        let totalNum = 0
        let totalPostagePrice = 0
        this.goodsList.forEach(res => {
          totalPrice += res.mallPrice
          totalNum += res.goodsNum
          totalPostagePrice += res.postagePrice
        })
        if (this.memberList.length) {
          this.memberList.forEach(res => {
            this.$set(res, 'checked', false)
          })
        }
        this.totalNum = totalNum
        this.totalPrice = totalPrice.toFixed(2)
        this.totalPostagePrice = totalPostagePrice.toFixed(2)
        if (this.newCoupon) {
          this.coupon = this.newCoupon // this.newCoupon来自$store.state
        }
        if (this.newAddress) {
          this.address = this.newAddress // this.newAddress来自$store.state
        }
      }
    }, // 如果是购物车过来的进行相关购物车操作
    setItemEvent (e) {
      if (e.key === 'wxInstalled') {
        if (e.newVal) {
          this.submit(this.propPrice)
        }
        // that.wxInstalled = true
      }
      if (e.key === 'paySucceed') {
        if (e.newVal) {
          this.resultType = '4'
          this.removeSession()
        }
        this.$nextTick(() => {
          // this.$refs.payShow.hide()
          this.showPay = false
          this.$router.push({ path: '/payResult', query: { type: this.resultType } })
        })
      }
    }

  }
}
</script>

<style lang="scss" scoped>
// @import 'vue-vertify/dist/PtVertify.css';
.page{
  padding-top: 45px;
  overflow-y: auto;
  height: 100vh;
}
/deep/.v-input__slot{
  min-height: unset!important;
  input{
    text-align: center;
  }
}
.border-radius-0{
  border-radius: 0;
}
.goodsList + .goodsList{
  margin-top: 8px;
}
/deep/.v-text-field__details{
  display: none!important;
}
</style>
