<template>
  <div class="ma-3" v-if="recommendList.length">
    <div class="d-flex align-center py-2" >
      <v-divider class="flex-fill"></v-divider>
      <span class="subtitle-2 mx-3 text--secondary">推荐商品</span>
      <v-divider class="flex-fill"></v-divider>
    </div>
    <v-container class="py-0">
      <v-row>
        <v-col
          v-for="(item, i) in recommendList"
          @click="toDetail(item.goodsId)"
          :key="i"
          cols="6"
          class="pa-2"
        >
          <div class="isOutlined pa-1">
            <!-- <v-img aspect-ratio="1" :src="item.goodsCoverImg"></v-img> -->
            <v-card flat class="d-flex flex-column align-center">
              <img class="full-width" ref="vImage" :src="item.goodsCoverImg">
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
        </v-col>
      </v-row>
    </v-container>
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
</style>
