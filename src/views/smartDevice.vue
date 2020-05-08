<template>
  <div class="page grey lighten-3">
    <v-icon @click="$router.back()" color="pink lighten-4" class="backIcon" size="45">mdi-chevron-left-circle</v-icon>
    <img class="full-width" src="@/assets/img/smartDevicesBG.jpg">
    <div class="pa-2">
      <v-card
        white
        outlined
        flat
        v-for="(item, i) in list"
        :key="i"
        class="mb-2 pa-2"
      >
        <v-card flat class="grey lighten-2 pa-2 d-flex flex-column align-center mb-2">
          <h5>极简设计 一键操作  老人上手快</h5>
          <v-divider class="full-width my-1"></v-divider>
          <span class="caption">心率、运动、定位、SOS、语音播报、健康管理</span>
        </v-card>
        <div class="d-flex">
          <v-avatar
            size="85"
            tile
          >
            <img :src="item.goodsCoverImg">
          </v-avatar>
          <div class="ml-2 flex-fill d-flex flex-column justify-space-between caption">
            <div class="subtitle-2">{{item.goodsName}}</div>
            <div>
              <div>
                <span class="ml-2">{{item.goodsSales||0}}人付款</span>
              </div>
              <div v-if="item.goodsLabel" class="mb-1">
                <v-btn class="mr-2" v-for="(itm, idx) in item.goodsLabel.split(',')" :key="idx" depressed x-small color="primary" outlined>{{itm}}</v-btn>
              </div>
              <div class="d-flex align-center justify-space-between">
                <span class="primary--text subtitle-1">￥{{item.showPrice}}</span>
                <v-btn @click="toDetail(item.goodsId)" small color="primary" dark depressed rounded>
                  立即购买
                  <v-icon class="ml-1" dense>mdi-chevron-right-circle</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmartDevices',
  data: () => ({
    list: []
  }),
  mounted () {
    this.getList()
  },
  methods: {
    async getList () {
      const params = {
        type: 1,
        categoryId: 1
      }
      const res = await this.$http.get('/goods/findGoodsIde', { params })
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
  position: relative;
  padding-top: 118vw;
  >img{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }
  /deep/.backIcon{
    position: fixed;
    left: 6px;
    top: 6px;
    z-index: 12;
  }
}
</style>
