<template lang="html">
  <div class="homePage grey lighten-3">
    <iHeader
      right-text="分类"
      @back="back"
      @right="$router.push('./classify')"
    >
      <template v-slot:center>
        <v-input
          @click="$router.push('/search')"
          prepend-icon="mdi-magnify"
        >
        搜索新商品/商家
        </v-input>
        <!-- <input
          class="white--text body-2 py-2 searchBox"
          type="text"
          placeholder="搜索新商品/商家"
        > -->
      </template>
    </iHeader>
    <!-- 轮播 -->
    <v-carousel
      v-if="bannerList.length"
      :show-arrows="false"
      hide-delimiters
      height="125"
    >
      <v-carousel-item
        v-for="(item,i) in bannerList.slice(0, 10)"
        :key="i"
        cover
      >
        <img class="fill-height full-width" :src="item.bannerPic">
      </v-carousel-item>
    </v-carousel>
    <!-- 分类 -->
    <v-sheet>
      <v-tabs
        value="2"
        color="primary"
        height="35"
        hide-slider
        optional
        grow
      >
        <v-tab
          v-for="(item,i) in cates"
          :key="i"
          class="px-0 pr-2"
          :class="{'primary--text pl-2': i===0}"
          @click="navigateTo(item, i)"
          v-text="item.categoryName"
        />
      </v-tabs>
    </v-sheet>
    <v-card flat v-if="smartGoods && smartGoods.length" class="my-2 transparent">
      <v-subheader class="d-flex align-center justify-space-between white">
        <span class="primary--text">智能设备</span>
        <span  @click="$router.push('/smartDevice')" class="d-flex align-center">
          更多
          <v-icon>mdi-chevron-right</v-icon>
        </span>
      </v-subheader>
      <v-divider></v-divider>
      <v-container class="py-0">
        <v-row no-gutter>
        </v-row>
      </v-container>
      <div class="red lighten-5 d-flex flex-wrap justify-space-between pa-2 pb-0">

        <v-card
          v-for="(item, i) in smartGoods.slice(0, 4)"
          @click="toDetail(item.goodsId)"
          :key="i"
          tile
          class="space-evenly-width pa-0 mb-2 d-flex flex-column"
        >
          <v-responsive class="full-width ratio1" :aspect-ratio="1">
            <img class="full-width fill-height" :src="item.goodsCoverImg">
          </v-responsive>
          <!-- <img class="full-width" ref="vImage" :src="item.goodsCoverImg"> -->
          <div class="white d-flex flex-column align-center px-2">
            <span class="ellipsis full-width caption mb-1">{{item.goodsName}}</span>
            <span class="primary--text full-width">￥{{item.showPrice}}</span>
          </div>
        </v-card>
      </div>
    </v-card>
    <v-card flat v-if="hotGoods.length" class="my-2 transparent">
      <v-subheader class="d-flex align-center justify-space-between white">
        <span class="primary--text">精选商品</span>
        <span @click="$router.push('/featuredGoods')" class="d-flex align-center">
          更多
          <v-icon>mdi-chevron-right</v-icon>
        </span>
      </v-subheader>
      <v-divider></v-divider>
      <v-container class="py-0">
        <v-row no-gutter>
          <v-col
            v-for="(item, i) in hotGoods"
            @click="toDetail(item.goodsId)"
            :key="i"
            cols="12"
            class="pa-0"
          >
            <div class="white d-flex pa-2">
              <v-avatar
                tile
                size="100"
              >
                <img :src="item.goodsCoverImg" :alt="item.goodsName">
              </v-avatar>
              <div class="flex-fill d-flex flex-column justify-space-between ml-2">
                <span class="ellipsis full-width subtitle-2 font-weight-bold">{{item.goodsName}}</span>
                <div>
                  <span class="primary--text full-width">
                    ￥{{item.showPrice}}
                    <span class="caption black--text">{{item.goodsSales}}人付款</span>
                  </span>
                  <div
                    v-if="item.goodsLabel"
                    class="d-flex"
                  >
                    <v-btn
                      v-for="(itm, idx) in item.goodsLabel.split(',')"
                      :key="idx" color="primary"
                      dark
                      outlined
                      x-small
                      class="px-1 mr-1"
                    >
                      {{itm}}
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
            <v-divider />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import iHeader from '@/components/public/header'
export default {
  name: 'Index',
  components: {
    iHeader
  },
  data () {
    return {
      pageSize: 10,
      pageNo: 1,
      bannerList: [],
      data: 1000,
      userId: 0,
      cates: [],
      hotGoods: [],
      smartGoods: [],
      tabIndex: 0
    }
  },
  computed: {
    origin () {
      return this.$store.state.app.origin
    },
    env () {
      return this.$store.state.app.env
    }
  },
  created () {
    console.log(this.isWeChat())
    if (this.isWeChat()) { // 微信公众号
      this.$store.commit('SET_ORIGIN', 'ORIGIN002')
      this.$store.commit('SET_ENV', 'weChat')
      return false
    }
    // app传sessionId, app才需要静默登陆
    const sessionId = window.location.hash.split('sessionId=')[1]
    if (sessionId) {
      this.$store.commit('SET_ORIGIN', 'ORIGIN001')
      this.$store.commit('SET_ENV', 'app')
      const data = {
        origin: this.origin,
        sessionId: sessionId
      }
      this.$http.post('/user/login', data).then(res => {
        if (res.data.success) {
          this.$store.commit('SET_EACH_USER_INFO', res.data.obj)
        }
      })
    }
  },
  mounted () {
    this.$store.commit('BOTTOM_NAV_INDEX', 0)
    if (!this.origin) {
      this.$store.commit('SET_ORIGIN', 'ORIGIN003')
      this.$store.commit('SET_ENV', 'h5')
    }
    const token1 = window.location.hash.split('token=')[1]
    const token2 = window.location.search.split('token=')[1]
    const token = token1 || token2
    if ((token !== 'null') && token) {
      const headers = {
        token
      }
      this.$http.get('/user/getUser', { headers })
        .then(res => {
          if (res.data.success) {
            this.$store.commit('SET_EACH_USER_INFO', res.data.obj)
          }
        })
    }
    this.init()
  },
  methods: {
    isWeChat () {
      const ua = window.navigator.userAgent.toLowerCase()
      return ua.indexOf('micromessenger') > -1
    },
    back () {
      if (localStorage.getItem('env') === 'app') {
        // location.href = "goback://"   // 回退到客户端
        localStorage.clear()
        const message = { backToApp: true }
        // eslint-disable-next-line no-undef
        webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(message))
      }
    },
    init () {
      this.getCategory()
      this.getHotGoods()
      this.getBannerList()
    },
    getCategory () {
      this.$http.get('/goods/getCategoryList').then(res => {
        if (res.data.success) {
          this.cates = res.data.obj
          this.findGoodsIde()
        }
      })
    },
    findGoodsIde () {
      const params = {
        type: 0,
        categoryId: this.cates[0].catId
        // categoryId: 1
      }
      this.$http.get('/goods/findGoodsIde', { params }).then(res => {
        if (res.data.success) {
          this.smartGoods = res.data.obj || []
          if (this.smartGoods.length) {
            this.$nextTick(() => {
              // 处理1：1的图片
              const arr = this.$refs.vImage
              arr.forEach(re => {
                const width = re.width
                re.height = width
              })
            })
          }
        }
      })
    },
    getHotGoods () {
      this.$http.get('/goods/getHotGoods').then(res => {
        if (res.data.success) {
          this.hotGoods = res.data.obj
        }
      })
    },
    getBannerList () {
      this.$http.get('/index/getBannerList').then(res => {
        if (res.data.success) {
          this.bannerList = res.data.obj
        }
      })
    },
    navigateTo (item, i) {
      this.$router.push({
        path: '/classify',
        query: {
          catId: item.catId,
          cateIndex: i
        }
      })
    },
    toDetail (e) {
      this.$router.push({
        path: '/goodsDetails',
        query: {
          goodsId: e
        }
      })
    }
  }
}
</script>
<style  lang="scss" scoped>
$vInputBg: #cc0505;
@import '@/assets/css/v-input.scss';
.homePage{
  padding-top: 45px;
  padding-bottom: 45px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}
/deep/.v-subheader{
  height: 35px;
}
/deep/.v-slide-group__prev{
  display: none!important;
}
/deep/.v-tab{
  min-width: unset!important;
}
/deep/.ratio1{
  max-height: calc((100vw - 24px)/2)!important;
}
.space-evenly-width{
  width: calc((100vw - 24px)/2);
}
</style>
