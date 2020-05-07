<template>
  <div class="page grey lighten-3">
    <iHeader @back="$router.back()" text="精选商品" />
    <div class="pa-2">
      <v-card
        white
        outlined
        flat
        v-for="(item, i) in list"
        :key="i"
        @click="toDetail(item.goodsId)"
        class="d-flex mb-2 pa-2"
      >
        <v-avatar
          size="75"
          tile
        >
          <img :src="item.goodsCoverImg">
        </v-avatar>
        <div class="ml-2 flex-fill d-flex flex-column justify-space-between caption">
          <div class="subtitle-2">{{item.goodsName}}</div>
          <div>
            <div>
              <span class="primary--text subtitle-1">￥{{item.showPrice}}</span>
              <span class="ml-2">{{item.goodsSales}}人付款</span>
            </div>
            <div v-if="item.goodsLabel">
              <v-btn class="mr-2" v-for="(itm, idx) in item.goodsLabel.split(',')" :key="idx" depressed x-small color="primary" outlined>{{itm}}</v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import iHeader from '@/components/public/header'
export default {
  name: 'FeaturedGoods',
  components: {
    iHeader
  },
  data: () => ({
    list: []
  }),
  mounted () {
    this.getList()
  },
  methods: {
    async getList () {
      const res = await this.$http.get('/goods/getHotGoods')
      if (res.data.success) {
        this.list = res.data.obj
      }
    },
    toDetail (goodsId) {
      this.$router.push({
        path: '/goodsDetails',
        query: {
          goodsId
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
}
</style>
