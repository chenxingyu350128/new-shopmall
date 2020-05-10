<template>
  <div v-if="recommendList.length">
    <div class="d-flex align-center py-2" >
      <v-divider class="flex-fill"></v-divider>
      <span class="subtitle-2 mx-3 text--secondary">推荐商品</span>
      <v-divider class="flex-fill"></v-divider>
    </div>
    <div class="d-flex flex-wrap justify-space-between pa-2">

      <v-card
        v-for="(item, i) in recommendList"
        @click="toDetail(item.goodsId)"
        :key="i"
        cols="6"
        tile
        class="space-evenly-width pa-0 mb-2 d-flex flex-column"
      >
        <v-responsive class="full-width ratio1" :aspect-ratio="1">
          <img class="full-width fill-height" :src="item.goodsCoverImg">
        </v-responsive>
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
    <!-- <v-container class="py-0">
      <v-row>
        <v-col
          v-for="(item, i) in recommendList"
          @click="toDetail(item.goodsId)"
          :key="i"
          cols="6"
          class="pa-2 "
        >
          <div class="isOutlined pa-1">
            <v-card flat class="d-flex flex-column align-center">
              <v-responsive class="full-width ratio1" :aspect-ratio="1">
                <img class="full-width fill-height" :src="item.goodsCoverImg">
              </v-responsive>
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
        </v-col>
      </v-row>
    </v-container> -->
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
  /deep/.ratio1{
    max-height: calc((100vw - 24px)/2)!important;
  }
  .space-evenly-width{
    width: calc((100vw - 24px)/2);
  }
</style>
