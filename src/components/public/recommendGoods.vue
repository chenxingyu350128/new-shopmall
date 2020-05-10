<template>
  <div v-if="recommendList.length">
    <div class="d-flex align-center py-2" >
      <v-divider class="flex-fill"></v-divider>
      <span class="subtitle-2 mx-3 text--secondary">推荐商品</span>
      <v-divider class="flex-fill"></v-divider>
    </div>
    <div class="pa-1vw d-flex flex-wrap">
      <div
        v-for="(item, i) in recommendList"
        @click="toDetail(item.goodsId)"
        :key="i"
        cols="6"
        class="vw485"
      >
        <div class="isOutlined overflow-hidden">
          <!-- <v-img aspect-ratio="1" :src="item.goodsCoverImg"></v-img> -->
          <v-avatar
            size="48.5vw"
            tile
          >
            <img :src="item.goodsCoverImg">
          </v-avatar>
          <v-card flat class="d-flex flex-column align-center pa-1">
            <!-- <img class="full-width" ref="vImage" :src="item.goodsCoverImg"> -->
            <!-- <img class="halfCardImage" :src="item.goodsCoverImg" :alt="item.goodsName"> -->
            <span class="ellipsis full-width caption">{{item.goodsName}}</span>
            <div v-if="item.goodsLabel" class="d-flex flex-wrap justify-space-between">
              <v-btn x-small outline color="primary" dark v-for="(itm, idx) in item.goodsLabel.split(',')" :key="idx">
                {{itm}}
              </v-btn>
            </div>
            <span class="primary--text subtitle-2 full-width">
              ￥{{item.showPrice}}
              <span class="caption black--text">{{item.goodsComment}}人付款</span>
            </span>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecommendGoods',
  data: () => ({
    recommendList: [],
    avatarSize: 'calc((100% - 16px)/2)'
  }),
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$http.get('/goods/findGoodsRecommend')
        .then(res => {
          if (res.data.success) {
            this.recommendList = res.data.obj
            this.$nextTick(() => {
              // 处理1：1的图片
              const arr = this.$refs.vImage
              arr.forEach(re => {
                const width = re.width
                re.height = width
              })
            })
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

<style lang="scss" scoped>
  /deep/.isOutlined{
    border: 1px #ccc solid;
  }
  .pa-1vw{
    padding: 1vw;
  }
  .vw485{
    width: 48.5vw;
    margin-bottom: 1vw;
    &:nth-child(even){
      margin-left: 1vw;
    }
  }
</style>
