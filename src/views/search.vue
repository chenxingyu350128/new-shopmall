<template lang="html">
  <div class="page white">
    <iHeader
      rightText="搜索"
      @back="$router.back()"
      @right="searchData()"
    >
      <template v-slot:center>
        <div>
          <v-text-field
            v-model="keyValue"
            color="black"
            light
            autofocus
            @keyup.enter="searchData"
            :placeholder="placeholder"
            prepend-icon="mdi-magnify"
          ></v-text-field>
        </div>
      </template>
    </iHeader>
    <!-- 未搜索 -->
    <div v-if="neverSearch">
      <v-subheader class="d-flex justify-space-between">
        <span>历史搜索</span>
        <v-icon @click="clear" dense>mdi-trash-can-outline</v-icon>
      </v-subheader>
      <div v-if="searchHistory.length" class="pa-6 d-flex flex-wrap">
        <v-btn
          v-for="(item, i) in searchHistory"
          :key="i"
          class="caption mr-2 mb-2"
          rounded
          color="primary"
          dark
          @click="onSearch(item)"
          small
          outlined
          v-text="item"
        >
          <!-- {{item.toString().toLowerCase()}} -->
        </v-btn>
      </div>
      <v-divider />

      <v-subheader class="d-flex justify-space-between">
        <span>热门搜索</span>
        <v-icon dense>mdi-eye-outline</v-icon>
      </v-subheader>
      <div class="pa-6 d-flex flex-wrap">
        <v-btn
          v-for="(item, i) in hotSearchList"
          :key="i"
          class="caption mr-2 mb-2"
          rounded
          color="primary"
          @click="onSearch(item.hotSearchName)"
          dark
          small
          outlined
        >
          {{item.hotSearchName}}
        </v-btn>
      </div>
    </div>
    <!-- 搜索结果 -->
    <div v-else>
      <!-- 搜索空提示 -->
      <none v-if="!resultList.length" class="mt-2" :text="`抱歉，没有找到与“${placeholder}”相关的商品`" />
      <!-- 搜索结果 -->
      <v-subheader
        class="d-flex justify-space-between"
        v-if="resultList.length"
      >
        搜索结果
        <span>
          共<span class="primary--text">{{resultList.length}}</span>
          件商品
        </span>
      </v-subheader>
      <!-- 商品列表 -->
      <!-- <v-divider></v-divider> -->
      <v-tabs
        v-if="resultList.length"
        v-model="typeIndex"
        @change="onTypeChange"
        height="30"
        grow
      >
        <v-tab
          v-for="(item, i) in tabList"
          :key="i"
          class="pa-0 flexFill"
        >
          <v-spacer></v-spacer>
          {{item}}
          <v-icon
            v-if="i === tabList.length - 1"
            @click.stop="priceToggle"
          >
            {{priceReverse ? 'mdi-chevron-down' : 'mdi-chevron-up'}}
          </v-icon>
          <v-spacer></v-spacer>
          <v-divider v-if="i !== tabList.length - 1" vertical inset></v-divider>
        </v-tab>
      </v-tabs>
      <!-- <v-divider></v-divider> -->
      <van-list
        v-if="resultList.length"
        :immediate-check="true"
        :finished="allLoaded"
        loading-text="加载中..."
        finished-text="已全部加载完"
        @load="loadBottom"
        class="pa-3"
      >
        <v-card
          v-for="(item, i) in resultList"
          @click="toDetail(item.goodsId)"
          :key="i"
          outlined
          class="mb-3 d-flex pa-2"
        >
          <v-avatar
            size="75"
            tile
            class="mr-2"
          >
            <img :src="item.goodsCoverImg" :alt="item.goodsName">
          </v-avatar>
          <div class="ellipsis flex-fill d-flex flex-column justify-space-between">
            <span class="full-width ellipsis subtitle-2">{{item.goodsName}}</span>
            <div>
              <span class="primary--text">
                ￥{{item.showPrice}}
                <span class="secondary--text caption ml-2">{{item.goodsSales}}人付款</span>

              </span>
              <div v-if="item.goodsLabel">
                <v-btn
                  v-for="(itm, idx) in item.goodsLabel.split(',')"
                  :key="idx"
                  outlined
                  color="primary"
                  dark
                  x-small
                >
                  {{item}}
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </van-list>
    </div>
    <!-- 推荐商品 -->
    <recommendGoods />
  </div>
</template>

<script>

// import Util from '@/util/common.js'
import iHeader from '@/components/public/header'
import none from '@/components/public/none'
import recommendGoods from '@/components/public/recommendGoods.vue'
export default {
  name: 'Search',
  components: {
    iHeader,
    none,
    recommendGoods
  },
  data: () => ({
    keyValue: '', // 用来双向绑定
    searchKey: '', // 用来作为发起请求的searchKey参数
    neverSearch: true,
    // list: Util.getLocal('searchList'),
    resultList: [], // 搜索结果
    hotSearchList: [], // 热搜
    recommendList: [], // 推荐商品
    tabList: ['综合', '销量', '价格'],
    allLoaded: false,
    priceReverse: false,
    typeIndex: 0,
    page: 1,
    rows: 1
  }),
  computed: {
    searchHistory () {
      return this.$store.state.app.searchList
    },
    placeholder () {
      return this.$store.state.app.current_key || '请输入商品名称'
    }
  },
  created () {
    this.loadBottom = this._.debounce(this.loadmore, 30)
  },
  mounted () {
    this.getHotSearch()
    // this.getRecommend()
  },
  methods: {
    getHotSearch () {
      this.$http.get('/index/getHotSearch').then(res => {
        if (res.data.code === '2000') {
          this.hotSearchList = res.data.obj
        }
      })
    },
    // getRecommend () {
    //   this.$http.get('/goods/findGoodsRecommend')
    //     .then(res => {
    //       if (res.data.success) {
    //         this.recommendList = res.data.obj
    //       }
    //     })
    // },
    clear () {
      this.$store.commit('CLEAR_SEARCH')
      // this.list = []
    },
    searchData () {
      if (!this.keyValue) {
        console.log('???')
        this.$toast.warning('请输入商品名称')
        return
      }
      this.$store.commit('ADD_SEARCH', this.keyValue)
      this.onSearch(this.keyValue)
    },
    onSearch (e) {
      this.$store.commit('SET_CURRENT_SEARCH', e)
      this.searchKey = e
      this.page = 1
      this.getResult()
    },
    onTypeChange (i) {
      this.page = 1
      this.getResult()
    },
    priceToggle () {
      this.$nextTick(() => {
        this.priceReverse = !this.priceReverse
        this.page = 1
        this.getResult()
      })
    },
    getResult (e) {
      let type = this.typeIndex + 1
      if (this.typeIndex === this.tabList.length - 1 && this.priceReverse) {
        type = this.typeIndex + 2
      }
      const params = {
        searchKey: this.searchKey,
        type,
        currentPage: this.page,
        pageSize: this.rows
      }
      this.$http.get('/index/getSearchGoods', { params })
        .then(res => {
          if (res.data.success) {
            const rows = res.data.rows
            const pager = res.data.pager
            this.allLoaded = pager.currentPage === pager.totalPages
            this.resultList = e ? this.resultList.concat(rows) : rows
          }
        })
        .finally(() => {
          this.neverSearch = false
        })
    },
    loadmore () {
      this.page++
      this.getResult('Yo')
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

<style lang="scss" scoped>
$textFieldBg: #f8f8f8;
@import '@/assets/css/v-text-field.scss';
.page{
  height: 100vh;
  padding-top: 45px;
  overflow-y: auto;
}
/deep/.v-subheader{
  height: 35px!important;
}
/deep/ .van-list__finished-text{
  line-height: 35px!important;
}
.halfCardImage{
  width: calc((100vw - 16px)/2);
  height: calc((100vw - 16px)/2);
  max-width: 100%;
}
.outlined{
  border: 1px #ccc solid;
}
</style>
