<template>
  <div class="page">
    <iHeader @back="$router.back()" text="评价"></iHeader>
    <v-tabs
      v-model="typeIndex"
      color="primary"
      grow
      height="40"
      slider-color="primary"
      @change="onTabChange"
    >
      <v-tab v-for="(item, i) in tabList" :key="i" class="caption">
        <span>{{item.name}}</span>
        <span>{{item.count}}</span>
      </v-tab>
    </v-tabs>
    <div class="pt40">
      <v-divider></v-divider>
      <div class="d-flex pa-2 justify-space-between caption nowrap">
        <span>好评率({{goodEvalRate}})</span>
        <span>好评({{goodEvalRate}})  中评({{averageEvalRate}})   差评({{chapEvalRate}})</span>
      </div>
      <v-divider></v-divider>
    </div>
    <van-list
      v-if="list.length"
      :immediate-check="true"
      :finished="allLoaded"
      loading-text="加载中..."
      finished-text="已全部加载完"
      @load="loadBottom"
      class="px-2"

    >
      <v-card
        v-for="(item, i) in list"
        :key="i"
        class="my-2 pa-2"
      >
        <div class="d-flex align-center">
          <v-avatar
            size="50"
            tile
          >
            <img :src="item.img">
          </v-avatar>
          <div class="flex-fill ml-2">
            <div class="subtitle-2 flex-fill d-flex">
              {{item.userName}}
              <span class="caption flex-fill text-right">{{item.createTime}}</span>
            </div>
            <v-rating readonly background-color="primary" x-small dense v-model="item.eval"></v-rating>
          </div>
        </div>
        <p class="my-2 body-2">{{item.content}}</p>
        <v-divider v-if="item.img"></v-divider>
        <div v-if="item.img" class="d-flex mt-2">
          <img class="pic" v-for="(itm, idx) in item.img.split(',')" :key="idx" :src="itm" alt="">
        </div>
      </v-card>
    </van-list>
  </div>
</template>

<script>
import iHeader from '@/components/public/header.vue'
export default {
  name: 'GoodsEvaluated',
  components: {
    iHeader
  },
  data: () => ({
    goodsId: 0,
    page: 1,
    rows: 10,
    allLoaded: false,
    list: [],
    goodEvalRate: 0,
    goodCount: 0,
    chapCount: 0,
    count: 0,
    averageEvalRate: 0,
    chapEvalRate: 0,
    averageCount: 0,
    imgCount: 0,
    tabList: [],
    typeIndex: 0
  }),
  created () {
    this.loadBottom = this._.debounce(this.loadmore, 30)
  },
  mounted () {
    this.goodsId = this.$route.query.goodsId
    this.findEvalPage()
    this.findEvalStat()
  },
  methods: {
    findEvalPage (e) {
      const params = {
        goodsId: this.goodsId,
        currentPage: this.page,
        pageSize: this.rows,
        type: this.typeIndex
      }
      this.$http.get('/order/findEvalPage', { params })
        .then(res => {
          if (res.data.success) {
            const pager = res.data.pager
            const rows = res.data.rows
            this.allLoaded = pager.currentPage === pager.totalPages
            this.list = e ? this.list.concat(rows) : rows
          }
        })
    },
    loadmore () {
      this.page++
      this.findEvalPage('Yo')
    },
    onTabChange () {
      this.page = 1
      this.findEvalPage()
    },
    findEvalStat () {
      const params = {
        goodsId: this.goodsId
      }
      this.$http.get('/order/findEvalStat', { params })
        .then(res => {
          if (res.data.success) {
            const obj = res.data.obj
            for (const x in obj) {
              this[x] = obj[x]
            }
            this.tabList = [
              {
                name: '全部评价',
                count: this.count
              },
              {
                name: '晒图数',
                count: this.imgCount
              },
              {
                name: '好评数',
                count: this.goodCount
              },
              {
                name: '中评数',
                count: this.averageCount
              },
              {
                name: '差评数',
                count: this.chapCount
              }
            ]
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  overflow-y: auto;
  padding-top: 45px;
  overflow-x: hidden;
}
.pt40{
  padding-top: 40px!important;
}
.pic{
  max-width: calc((100vw - 16px) / 4);
  max-height: calc((100vw - 16px) / 4);
}
/deep/ .v-tabs{
  z-index: 9;
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  .v-tab{
    min-width: unset;
    padding: 0;
  }
  div[role='tablist']{
    .v-slide-group__prev{
      display: none!important;
    }
  }
}
</style>
