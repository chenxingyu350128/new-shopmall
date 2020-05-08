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
      <v-tab v-for="(item, i) in tabList" :key="i">
        <span>{{item.name}}</span>
        <span>{{item.count}}</span>
      </v-tab>
      <v-divider></v-divider>
    </v-tabs>
    <div class="pt40">
      <v-divider></v-divider>
      <div class="d-flex px-4 py-2 justify-space-between caption">
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
      class="px-3"

    >
      <div
        v-for="(item, i) in list"
        :key="i"
      >
        <div class="d-flex">
          <div class="left">

          </div>
          <div class="right">
            {{item.createTime}}
          </div>
        </div>
      </div>
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
