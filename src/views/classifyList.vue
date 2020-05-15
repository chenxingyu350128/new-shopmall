<!--商品分类/搜索结果-->
<template >
  <div
    class="page white"
    :class="{'grey lighten-3': goodsList.length}"
  >
    <iHeader
      @back="$router.push('/index')"
      @right="$router.push('/index')"
    >
      <template v-slot:center>
        <v-input
          light
          color="grey"
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
      <template v-slot:right>
        <v-icon>mdi-home-outline</v-icon>
      </template>
    </iHeader>
    <v-tabs
      v-model="cateIndex"
      height="30"
      @change="ontabClick"
    >
      <v-tab
        v-for="(item, i) in categoryList"
        :key="i"
        class="pa-2"
      >
        <v-spacer></v-spacer>
          {{item.categoryName}}
        <v-spacer></v-spacer>
        <v-divider v-if="i !== categoryList.length - 1" vertical inset></v-divider>
      </v-tab>
    </v-tabs>
    <!-- <v-divider></v-divider> -->
    <!-- 排序 -->
    <v-tabs
      v-model="typeIndex"
      @change="onTypeChange"
      height="30"
      grow
      class="typeTabs"
    >
      <v-tab
        v-for="(item, i) in typeList"
        :key="i"
        class="pa-0 flexFill"
      >
        <v-spacer></v-spacer>
        {{item}}
        <v-icon
          v-if="i === typeList.length - 1"
          @click="priceToggle"
        >
          {{priceReverse ? 'mdi-chevron-up' : 'mdi-chevron-down'}}
        </v-icon>
        <v-spacer></v-spacer>
        <v-divider v-if="i !== typeList.length - 1" vertical inset></v-divider>
      </v-tab>
    </v-tabs>
    <!-- <v-divider></v-divider> -->
    <van-list
      v-if="goodsList.length"
      :immediate-check="true"
      :finished="allLoaded"
      loading-text="加载中..."
      finished-text="已全部加载完"
      @load="loadBottom"
      class="px-3"
    >
      <v-card
        v-for="(item, i) in goodsList"
        @click="toDetail(item.goodsId)"
        :key="i"
        outlined
        class="mb-3 d-flex pa-2"
      >
        <v-avatar
          size="85"
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
              <span class="secondary--text caption ml-2">{{item.goodsComment}}人付款</span>
            </span>
            <div v-if="item.goodsLabel">
              <v-btn
                v-for="(itm, idx) in item.goodsLabel.split(',')"
                :key="idx"
                outlined
                color="primary"
                dark
                x-small
                class="px-1 mr-1"
              >
                {{itm}}
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </van-list>
    <none v-else />
    <!-- <div  class="d-flex flex-column align-center">
      <img style="width: 200px; height: 120px" src="@/assets/img/none.jpg" alt="">
      <span class="mt-2 primary--text caption">什么都没有~~</span>
    </div> -->
  </div>
</template>

<script>
// import Cheader from '@/components/home/header'
import iHeader from '@/components/public/header'
import none from '@/components/public/none.vue'
export default {
  name: 'Classify',
  components: {
    iHeader,
    none
  },
  data () {
    return {
      catId: 0,
      searchKey: '',
      cateIndex: 0,
      typeIndex: 0,
      typeList: ['综合', '销量', '价格'],
      categoryList: [],
      page: 1,
      rows: 10,
      noPages: false,
      fromSearch: false,
      goodsList: [],
      sortFlag: false,
      type: 1,
      bottomPullText: '',
      priceReverse: false,
      current_keyword: this.$route.query.searchKey || '搜索商品'
      // showTip: false// 辅助显示提示
    }
  },
  created () {
    this.loadBottom = this._.debounce(this.loadmore, 50)
  },
  mounted () {
    this.catId = this.$route.query.catId
    this.cateIndex = this.$route.query.cateIndex
    this.cateList()
  },
  methods: {
    back () {
      this.$router.back()
    },
    cateList () {
      this.$http.get('/goods/getCategoryList').then(res => {
        if (res.data.success) {
          this.categoryList = res.data.obj
          if (!this.catId) {
            this.catId = this.categoryList[0].catId
          }
          this.getList()
        }
      })
    },
    ontabClick (i) {
      this.catId = this.categoryList[i].catId
      this.page = 1
      this.getList()
    },
    onTypeChange (i) {
      this.page = 1
      this.getList()
    },
    priceToggle () {
      this.$nextTick(() => {
        this.priceReverse = !this.priceReverse
        this.page = 1
        this.getList()
      })
    },
    getList (e) {
      let type = this.typeIndex + 1
      if (this.typeIndex === this.typeList.length - 1 && this.priceReverse) {
        type = this.typeIndex + 2
      }
      const params = {
        categoryId: this.catId,
        currentPage: this.page,
        pageSize: this.rows,
        type

      }
      this.$http.get('/goods/findGoodsPage', { params })
        .then(res => {
          if (res.data.success) {
            const rows = res.data.rows
            const pager = res.data.pager
            this.allLoaded = pager.currentPage === pager.totalPages
            this.goodsList = e ? this.goodsList.concat(rows) : rows
          }
        })
    },
    toDetail (id) {
      this.$router.push({
        path: '/goodsDetails',
        query: {
          goodsId: id
        }
      })
    },
    // 上啦加载
    loadmore () {
      this.page++
      this.getList('Yo')
    }
  }

}

</script>
<style lang="scss" scoped>
$vInputBg: #fff;
@import '@/assets/css/v-input.scss';
.page{
  height: 100vh;
  padding-top: 113px;
  overflow-y: auto;
  overflow-x: hidden;
}
/deep/.v-tabs{
  position: fixed;
  top: 45px;
  z-index: 12;
}
/deep/.typeTabs{
  top: 75px;
}
// /deep/ .van-list{
//   padding-top: 113px!important;
// }
/deep/.v-slide-group__prev{
  display: none!important;
}
/deep/.v-tab{
  min-width: unset!important;
}
/deep/ .flexFill{
  flex: 1!important;
}
</style>
