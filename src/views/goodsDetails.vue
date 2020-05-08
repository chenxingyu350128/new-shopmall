// eslint-disable-next-line vue/no-v-html
<template>
  <div ref="page" class="page grey lighten-2">
    <iHeader @back="$router.back()" text="商品详情" @right="showShare=true">
      <template v-slot:right>
        <v-icon>mdi-share</v-icon>
      </template>
    </iHeader>
    <v-carousel
      class="white"
      hide-delimiters
      :show-arrows="isFalse"
      height="80vw"
    >
      <v-carousel-item
        v-for="(item, i) in carouselItems"
        :key="i"
        contain
      >
        <img class="fill-height full-width" :src="item">
      </v-carousel-item>
    </v-carousel>
    <!-- 价格 -->
    <v-divider></v-divider>
    <div class="d-block my-1 px-4 py-2 white">
      <div class="d-flex align-center justify-space-between">
        <span class="primary--text subtitle-1 font-weight-bold">{{goodsName}}</span>
        <div v-if="token" @click="addFollow" class="d-flex align-end">
          <v-icon :color="isFollowed ? 'primary' : ''" dense class="mr-1">mdi-star</v-icon>
          <span class="caption text--secondary">关注</span>
        </div>
      </div>
      <span>
        价格：<span class="primary--text font-weight-bold">￥{{showPrice}}起</span>
      </span>
    </div>
    <!-- 优惠券 -->
    <v-subheader v-if="couponList.length" @click="showCouponList=true" class="justify-space-between secondary--text white my-1">
      <div>
        <span>优惠</span>
        <span class="primary--text ml-4">领取优惠券</span>
      </div>
      <div>
        <span>领取</span>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </v-subheader>
    <!-- 规格 -->
    <v-subheader
      class="justify-space-between secondary--text white my-1"
      @click="showSku=true"
    >
      <span>{{skuName$}}</span>
      <v-icon>mdi-chevron-right</v-icon>
    </v-subheader>
    <!-- 评价 -->
    <v-subheader @click="toEvaluationPage" class="justify-space-between secondary--text white my-1">
      <span>全部评价({{goodsComment}})</span>
      <v-icon>mdi-chevron-right</v-icon>
    </v-subheader>
    <v-tabs
      v-model="tabIndex"
      color="primary"
      grow
      slider-color="primary"
    >
      <v-tab>商品详情</v-tab>
      <v-tab>售后保障</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabIndex">
      <v-tab-item class="goodsDetails pb-12" v-html="goodsDetails" />
      <v-tab-item class="pa-2 pb-12">
        <img
          class="full-width"
          :src="afterHeader"
        >
        <div
          v-for="(item,i) in 4"
          :key="i"
          class="my-2 subtitle-2"
        >
          <div class="d-flex align-end mb-2">
            <v-avatar
              size="24"
              tile
            >
              <img :src="icons[item-1]">
            </v-avatar>
            <span class="ml-2 font-weight-bold">{{ title[item-1] }}</span>
          </div>
          <div class="textIndent caption">
            {{ desc[item - 1] }}
          </div>
        </div>
        <img
          class="full-width"
          :src="afterFooter"
        >
      </v-tab-item>
    </v-tabs-items>
    <!-- 分享 -->
    <v-bottom-sheet v-model="showShare">
      <div class="white pa-2 text--secondary">
        分享到
      </div>
      <div class="white d-flex justify-space-around py-4 subtitle-2 text--secondary">
        <div
          class="d-flex flex-column align-center"
          @click="share(1)"
        >
          <v-btn
            depressed
            dark
            fab
            small
            color="green accent-4"
          >
            <v-icon>mdi-wechat</v-icon>
          </v-btn>
          微信好友
        </div>
        <div
          class="d-flex flex-column align-center"
          @click="share(2)"
        >
          <v-btn
            depressed
            dark
            fab
            small
            color="green accent-4"
          >
            <v-icon>mdi-camera-iris</v-icon>
          </v-btn>
          朋友圈
        </div>
      </div>
    </v-bottom-sheet>
    <!-- 优惠券 -->
    <v-bottom-sheet v-model="showCouponList">
      <div class="white py-2">
        <div class="d-flex justify-space-between px-1 primary--text">
          <i style="width: 24px; height: 24px"></i>
          <span>优惠</span>
          <v-icon @click="showCouponList=false" color="primary">mdi-close-box</v-icon>
        </div>
        <iCoupon @click.native="takeCoupon(item, item.couponId)" v-for="(item, i) in couponList" :key="i" class="mt-2" :item="item" />
      </div>
    </v-bottom-sheet>
    <!-- 规格选择 -->
    <v-bottom-sheet v-model="showSku">
      <div class="white">
        <div class="d-flex pa-4">
          <v-avatar
            size="85"
            tile
          >
            <img :src="goodsCoverImg">
          </v-avatar>
          <div class="ml-2 flex-fill subtitle-2 d-flex flex-column justify-space-between">
            <span class="font-weight-bold">{{goodsName}}</span>
            <span class="grey--text text-lighten-2 caption">{{skuName$}}</span>
            <span class="primary--text">￥{{mallPrice}}</span>
            <span class="">库存: {{goodsStock}}件</span>
          </div>
        </div>
        <v-divider></v-divider>
        <div
          v-for="(item, i) in goodsSpecList"
          :key="i"
          class="px-4 py-2"
        >
          <div class="subtitle-1 my-2">
            {{item.specName}}:
          </div>
          <div>
            <v-btn
              small
              depressed
              v-for="(itm, idx) in item.specList"
              :key="idx"
              color="primary"
              class="mr-2 mb-2"
              @click="chooseSku(itm, i)"
              :outlined="itm.specvNo !== skuId$.split('_')[i]"
            >
              {{itm.specvName}}
            </v-btn>
          </div>
        </div>
        <div v-if="goodsType === 1" class="px-4 py-2 mb-2 d-flex justify-space-between">
          <span>购买数量：</span>
          <div class="d-flex align-center">
            <v-icon :color="goodsNum > 1 ? 'primary' : ''" @click="decrease">mdi-minus-box-outline</v-icon>
            <v-card class="d-flex justify-center align-center mx-3" width="20" height="20" outlined>
              {{goodsNum}}
            </v-card>
            <v-icon :color="increaseAvailable ? 'primary' : ''" @click="increase">mdi-plus-box-outline</v-icon>
          </div>
        </div>
        <div class="d-flex">
          <v-btn large v-if="goodsType === 1" @click="addToCart" class="flexFill" color="primary" tile depressed outlined>加入购物车</v-btn>
          <v-btn large @click="addToOrder" class="flexFill" color="primary" tile depressed>立即购买</v-btn>
        </div>
      </div>
    </v-bottom-sheet>
    <v-btn small @click="scrollToTop" v-if="showToTop" class="pa-0 toTop" fab dark icon color="primary">
      <v-icon large dark>mdi-arrow-up-circle-outline</v-icon>
    </v-btn>
    <v-divider class="footerDivider"></v-divider>
    <v-footer fixed bottom class="d-flex align-center white px-2 py-1">
      <div
        @click="$router.push('/index')"
        class="flex-fill d-flex flex-column align-center"
      >
        <v-icon color="primary">mdi-home-outline</v-icon>
        <span class="overline mt-1">首页</span>
      </div>
      <div
        @click="toCartPage"
        class="flex-fill d-flex flex-column align-center"
      >
        <v-icon color="primary"> mdi-cart-outline</v-icon>
        <span class="overline mt-1">购物车</span>
      </div>
      <div class="d-flex flex-row-reverse ml-4">
        <v-btn v-if="goodsType === 1" class="ml-4" color="primary" @click="showSku=true" depressed small>加入购物车</v-btn>
        <v-btn color="primary" @click="showSku=true" depressed small>立即购买</v-btn>
      </div>
    </v-footer>
    <alertBox @cancel="showAlert=false" @certain="toLogin" :show="showAlert" :title="alertTitle" />
  </div>
</template>
<script>
import iHeader from '@/components/public/header.vue'
import iCoupon from '@/components/public/coupon.vue'
import alertBox from '@/components/public/alertBox.vue'
// import GSlider from "@/components/public/slider.vue"
// import orderSure from "@/components/cart/orderSure.vue"
export default {
  name: 'goodsDetails',
  components: {
    iHeader,
    iCoupon,
    alertBox
    // GSlider,
    // orderSure,
    // toTop
  },
  data () {
    return {
      alertTitle: '',
      isFalse: false,
      showShare: false,
      showToTop: false,
      showAlert: false,
      showSku: false,
      showCouponList: false,
      goodsComment: 0,
      goodsCoverImg: '',
      goodsDetails: '',
      goodsId: 0,
      goodsImgs: '',
      goodsName: '',
      goodsSales: 0,
      goodsNum: 1,
      goodsSkuList: [],
      goodsSpecList: [],
      skuList: [],
      skuIdGroup: [],
      skuNameGroup: [],
      skuName$: '',
      skuId$: '',
      goodsType: 0,
      originalPrice: 0,
      postagePrice: 0,
      showPrice: 0,
      isFollowed: 0,
      carouselItems: [],
      couponList: [],
      tabIndex: 0,
      showBase: false, // 显示popup
      eachActive: [],
      afterHeader: require('@/assets/img/afterheader.jpg'),
      afterFooter: require('@/assets/img/afterfooter.jpg'),
      specificNames: [], // 获取到的各个规格的名字，
      specificIds: [], // 获取到的各个规格的id，
      skuIdPairs: '', // 获取到的id-配对们，还需要根据计算到的id-id去匹配
      idsGet: '',
      icons: [
        require('@/assets/img/icon_1.png'),
        require('@/assets/img/icon_2.png'),
        require('@/assets/img/icon_3.png'),
        require('@/assets/img/icon_4.png')
      ],
      chooseMsg: '', // 规格选择信息
      currentIndex: undefined,
      selected: 'container_1',
      detailData: [],
      skuInfo: '',
      link: [],
      goodsDetail: [],
      goodsSkus: [],
      orderSureList: [],
      count: 1,
      store_id: 1,
      slider: [],
      showName: ' ',
      disabled: false,
      sku_id: '',
      sku_name: '',
      indices: [],
      price: 0,
      fixedFlag: false,
      offsetTop: 0,
      headerFlag: true,
      attention: false,
      // attentionImg: img_off,
      // mallPrice: 0,
      title: ['颐纳福商城承若', '正品行货', '全国联保', '权利声明'],
      desc: [
        '颐纳福商城平台销售并发货的商品，由平台提供发票和相应的售后服务，请您放心购买',
        '颐纳福商城向您保障所售商品均为正品行货，颐纳福商品将开具正规发票',
        '凭质保证书及颐纳福商城发票，可享受全国联保服务，与您亲临商场选购的商品享受相同的质量保证。颐纳福商城还为您提供具有竞争力的商品价格和运费政策，请您放心购买！',
        '颐纳福商城平台上的所有商品信息、商品咨询、网友讨论等内容，是颐纳福重要的经营资源，未经许可，禁止非法转载使用注：\n本站商品信息均来自于合作方，其真实性、准确性和合法性由信息拥有者（合作方）负责。本站不提供任何保证，并不承担任何法律责任。'
      ]
    }
  },
  computed: {
    userId () {
      return this.$store.state.app.userId
    },
    token () {
      return this.$store.state.app.token
    },
    goodsStock () {
      let result = 0
      this.goodsSkuList.some(res => {
        if (res.skuGroupIds === this.skuId$) {
          result = res.goodsStock
          return true
        }
      })
      return result
    },
    mallPrice () {
      let result = 0
      this.goodsSkuList.some(res => {
        if (res.skuGroupIds === this.skuId$) {
          result = res.mallPrice
          return true
        }
      })
      return result
    },
    increaseAvailable () {
      return this.goodsNum < this.goodsStock && this.goodsNum < 99
    }
  },
  mounted () {
    this.goodsId = this.$route.query.goodsId
    this.scrollEvent()
    this.getGoodsDetails()
    if (this.token) {
      this.findGoodsCoupon() // 优惠券
      this.checkFollow() // 商品是否已关注
      this.findGoodsTracks() // 添加足迹
    }
  },
  methods: {
    scrollEvent () {
      const that = this
      const page = this.$refs.page
      page.addEventListener('scroll', function (e) {
        // e.target.clientHeight
        // e.target.scrollTop
        const clientHeight = e.target.clientHeight
        const scrollTop = e.target.scrollTop
        // 上拉一个屏幕的高度才出现
        that.showToTop = clientHeight < scrollTop
      })
    },
    async findGoodsTracks () {
      const data = {
        goodsId: this.goodsId
      }
      await this.$http.post('/user/addGoodsTracks', data)
    },
    toLogin () {
      this.showAlert = false
      this.$router.push('/login')
    },
    scrollToTop () {
      const page = this.$refs.page
      page.scrollTo(0, 0)
    },
    decrease () {
      if (this.goodsNum > 1) {
        this.goodsNum--
      }
    },
    increase () {
      if (this.increaseAvailable) {
        this.goodsNum++
      }
    },
    toEvaluationPage () {
      if (this.goodsComment) {
        this.$router.push({
          path: '/goodsEvaluated',
          query: {
            goodsId: this.goodsId
          }
        })
      }
    },
    findGoodsCoupon () {
      const params = {
        goodsId: this.goodsId
      }
      this.$http.get('/goods/findGoodsCoupon', { params })
        .then(res => {
          if (res.data && res.data.success) {
            this.couponList = res.data.obj
          }
        })
    },
    takeCoupon (item, couponId) {
      console.log('lll')
      const dateNow = Date.now()
      const end = Date.parse(item.endTime)
      const start = Date.parse(this.startTime)
      console.log(dateNow, start, end)
      const checked = start <= dateNow && end >= dateNow
      if (!checked) {
        return false
      }
      // 关闭领券视图
      this.showCouponList = false
      const data = {
        couponId
      }
      this.$http.post('/goods/bindCouponUser', data)
        .then(res => {
          if (res.data.success) {
            // 领取成功,领券接口重置
            this.findGoodsCoupon()
          }
        })
    },
    getGoodsDetails () {
      const params = {
        goodsId: this.goodsId
      }
      this.$http.get('/goods/getGoods', { params })
        .then(res => {
          if (res.data.success) {
            const obj = res.data.obj
            for (const x in obj) {
              this[x] = obj[x]
            }
            const images = this.goodsImgs.split(',')
            this.carouselItems = [this.goodsCoverImg].concat(images)
            this.skuList = this.goodsSpecList.map(res => res.specList)
            this.skuIdGroup.length = this.skuNameGroup.length = this.skuList.length
            this.skuList.forEach((res, i) => {
              res.forEach((re, idx) => {
                this.$set(res, 'checked', !idx)
              })
              // 初始化规格名称和id，默认为第一项
              this.skuNameGroup[i] = res[0].specvName
              this.skuIdGroup[i] = res[0].specvNo
            })
            this.getInitial()
          }
        })
    },
    getInitial () {
      // 最终str
      const nLen = this.skuNameGroup.length
      const nameArr = [
        {
          state: nLen === 0,
          result: '请选择规格'
        },
        {
          state: nLen === 1,
          result: '已选：' + this.skuNameGroup[0]
        },
        {
          state: nLen > 1,
          result: this.checkNoEmpty(this.skuNameGroup) ? '已选：' + this.skuNameGroup.join('-') : '请选择规格'
        }
      ]
      nameArr.forEach(res => {
        if (res.state) {
          this.skuName$ = res.result
        }
      })
      // 最终id
      const iLen = this.skuIdGroup.length
      const idArr = [
        {
          state: iLen === 0,
          result: ''
        },
        {
          state: iLen === 1,
          result: this.skuIdGroup[0]
        },
        {
          state: iLen > 1,
          result: this.checkNoEmpty(this.skuIdGroup) ? this.skuIdGroup.join('_') : ''
        }
      ]
      idArr.forEach(res => {
        if (res.state) {
          this.skuId$ = res.result
        }
      })
    },
    checkNoEmpty (e) {
      let allFilled = true
      for (let i = 0; i < e.length; i++) {
        if (!this.skuIdGroup[i]) {
          allFilled = false
        }
      }
      return allFilled
    },
    chooseSku (itm, i) {
      const nameArr = this.skuName$.split('-')
      const idArr = this.skuId$.split('_')
      nameArr[i] = itm.specvName
      idArr[i] = itm.specvNo
      this.skuName$ = nameArr.join('-')
      this.skuId$ = idArr.join('_')
    },
    checkFollow () {
      if (!this.token) {
        return false
      }
      const params = {
        goodsId: this.goodsId
      }
      this.$http.get('/goods/isFollowByGoodsId', { params })
        .then(res => {
          if (res.data.success) {
            this.isFollowed = !!res.data.obj
          }
        })
    },
    addFollow () {
      if (this.isFollowed) {
        return false
      }
      const params = {
        goodsId: this.goodsId
      }
      this.$http.post('/user/addGoodsFollow', params)
        .then(res => {
          if (res.data.success) {
            this.isFollowed = !this.isFollowed
          }
        })
    },
    toCartPage () {
      if (!this.token) {
        this.showAlert = true
        this.alertTitle = '未登陆无法查看购物车，是否前往登录页面？'
        return false
      }
      this.$router.push('/cart')
    },
    async addToCart () {
      if (!this.token) {
        this.showAlert = true
        this.alertTitle = '未登陆无法进行后续操作，是否前往登录页面？'
        return false
      }
      if (!this.goodsStock) {
        this.$toast('该商品暂无库存，请选择其他商品', {
          y: 'top',
          color: 'warning'
        })
        return false
      }
      const data = {
        goodsId: this.goodsId,
        skuGroupIds: this.skuId$,
        goodsNum: this.goodsNum
      }
      const res = await this.$http.post('/cart/addCart', data)
      if (res.data && res.data.success) {
        this.showSku = false
        this.$toast('加入购物车成功', {
          y: 'top',
          color: 'warning'
        })
      }
    },
    addToOrder () {
      if (!this.goodsStock) {
        this.$toast('该商品暂无库存，请选择其他商品', {
          y: 'top',
          color: 'warning'
        })
        return false
      }
      // 未登录状态也可到达订单确认页
      // if (!this.token) {
      //   this.showAlert = true
      //   return false
      // }

      const data = {
        goodsIds: this.goodsId,
        skuGroupIds: this.skuId$,
        goodsNums: this.goodsNum
      }
      this.$store.commit('SET_ORDER_CONFIRM_DATA', data)
      this.$router.push('/certainOrder')
    },
    share (e) {
      this.showShare = false
      const shareInfo = {
        url: location.href,
        way: e
      }
      // 这里发送数据到给app处理
      window.webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(shareInfo))
    }
  }
}
</script>

<style lang="scss" scoped>
  .page{
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 45px;
    position: relative;
  }
  /deep/.goodsDetails{
    img {
      width: 100%;
    }
  }
  .textIndent{
    text-indent: 2em;
  }
  /deep/ .toTop{
    position: fixed;
    bottom: 52px;
    right: 0;
    z-index: 666;
  }
  /deep/ .footerDivider{
    width: 100%;
    position: fixed;
    bottom: 52px;
  }
  .flexFill{
    flex: 1;
  }
</style>
