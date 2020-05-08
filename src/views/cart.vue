<template>
  <div class="page">
    <iHeader @back="$router.back()" text="购物车" @right="editable=!editable" :rightText="editable?'完成':'编辑'" />
    <van-list
      class="px-2 py-4"
      v-if="list.length"
      :immediate-check="false"
      :finished="allLoaded"
      loading-text="加载中..."
      finished-text="已全部加载完"
      @load="loadBottom"
    >
      <v-card
        class="d-flex mb-2 pa-2"
        outlined
        v-for="(item, i) in list"
        :key="i"
        @click="toggleChecked(item)"
      >
        <div class="d-flex align-center">
          <v-icon
            :color="item.checked?'primary':'grey lighten-2'"
          >
            {{item.checked?'mdi-check-circle':'mdi-circle-outline'}}
          </v-icon>
        </div>
        <div class="ml-2 flex-fill d-flex">
          <v-avatar
            size="85"
            tile
            class="mr-2"
            @click.stop="toGoodsDetails(item.goodsId, item.cartId)"
          >
            <img :src="item.goodsImg">
          </v-avatar>
          <div class="flex-fill d-flex flex-column justify-space-between">
            <div class="subtitle-2">
              <div>{{item.goodsName}}</div>
              <div class="caption grey--text text-lighten-2">类型：{{item.skuNameStr}}</div>
            </div>
            <div class="d-flex pr-2 align-center justify-space-between">
              <span class="subtitle-1 primary--text">￥{{item.mallPrice}}</span>
              <div class="flex-fill d-flex align-center justify-end caption">
                <div class="d-flex align-center">
                  <v-icon :color="item.goodsNum > 1 ? 'primary' : ''" @click.stop="decrease(item)">mdi-minus-box-outline</v-icon>
                  <v-card class="mx-2 d-flex justify-center align-center" width="20" height="20" outlined>
                    {{item.goodsNum}}
                  </v-card>
                  <v-icon :color="increaseAvailable(item.goodsNum, item.goodsStock) ? 'primary' : ''" @click.stop="increase(item)">mdi-plus-box-outline</v-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </van-list>
    <none v-else text="购物车暂无商品，快去挑选商品吧！" />
    <!-- 失效商品 -->
    <div v-if="!editable && invalidGoods.length">
      <v-divider></v-divider>
      <v-subheader class="justify-space-between align-center" dense>
        已失效商品
        <v-btn @click="deleteInvalid" outlined small color="grey" depressed>清空失效商品</v-btn>
      </v-subheader>
      <v-divider></v-divider>
      <v-card v-for="(item, i) in invalidGoods" :key="i" outlined class="ma-2 pa-2 d-flex justify-space-between align-center">
        <v-btn x-small depressed dark color="grey lighten-1">失效</v-btn>
        <div class="flex-fill d-flex ml-2">
          <v-avatar
            size="65"
            tile
          >
            <img :src="item.goodsImg">
          </v-avatar>
          <div class="flex-fill d-flex flex-column justify-space-around ml-2 subtitle-2">
            <span>{{item.goodsName}}</span>
            <span class="overline text--secondary">商品已失效，请联系客服</span>
          </div>
        </div>
        <v-icon @click="deleteInvalid($event, item.cartId)">mdi-trash-can-outline</v-icon>
      </v-card>
    </div>
    <!-- 推荐商品 -->
    <recommendGoods v-if="!editable" />
    <!-- 结算底栏 -->
    <v-footer v-if="!editable && list.length" fixed bottom class="pa-0 white justify-space-between">
      <div class="d-flex align-end pa-1">
        <v-icon
          @click="toggleAllChecked"
          :color="this.allChecked?'primary':'grey lighten-2'"
        >
          {{this.allChecked?'mdi-check-circle':'mdi-circle-outline'}}
        </v-icon>
        <span class="caption">全选</span>
      </div>
      <div class="d-flex">
        <div class="caption">
          <span>
            合计：
            <span class="primary--text">{{totalPrice}}</span>
          </span>
          <div class="overline">（不含运费）</div>
        </div>
        <v-btn @click="checkOut" class="height-fill" depressed tile dark color="primary">结算({{totalNum}})</v-btn>
      </div>
    </v-footer>
    <!-- 删除底栏 -->
    <v-footer v-if="editable && list.length" fixed bottom class="pa-0 white justify-space-between">
      <div class="d-flex align-end pa-1">
        <v-icon
          @click="toggleAllChecked"
          :color="this.allChecked?'primary':'grey lighten-2'"
        >
          {{this.allChecked?'mdi-check-circle':'mdi-circle-outline'}}
        </v-icon>
        <span class="caption">全选</span>
      </div>
      <v-btn @click="deleteCart" class="height-fill" depressed tile dark color="primary">删除</v-btn>
    </v-footer>
    <alertBox title="是否确认清除选中的商品？" @cancel="showAlert=false" @certain="deleteCertain" :show="showAlert" />
  </div>
</template>

<script>
import iHeader from '@/components/public/header.vue'
import alertBox from '@/components/public/alertBox.vue'
import recommendGoods from '@/components/public/recommendGoods.vue'
import None from '@/components/public/none.vue'
export default {
  name: 'Cart',
  components: {
    iHeader,
    alertBox,
    recommendGoods,
    None
  },
  data () {
    return {
      page: 1,
      rows: 10,
      invalidCartIds: '',
      allLoaded: false,
      allChecked: false,
      showAlert: false,
      invalidGoods: [],
      editable: false
    }
  },

  computed: {
    totalPrice () {
      let money = 0
      this.list.forEach(goods => {
        if (goods.checked) {
          money += parseFloat(goods.mallPrice) * parseInt(goods.goodsNum)
        }
      })
      return money.toFixed(2)
    },
    totalNum () {
      let goodsNum = 0
      this.list.forEach(goods => {
        if (goods.checked) {
          goodsNum += goods.goodsNum
        }
      })
      return goodsNum
    },
    goodsNumList () { // 被选中的商品的各个数目
      const num = []
      let base = ''
      this.list.forEach(item => {
        if (item.checked) {
          num.push(item.goodsNum)
        }
      })
      if (num.length > 1) {
        base = num.reduce((x, y) => {
          return x + ',' + y
        })
      } else {
        base = num[0]
      }
      return base
    },
    goodsIdList () { // 被选中的商品的各个id
      const id = []
      let base = ''
      this.list.forEach(good => {
        if (good.checked) {
          id.push(good.goodsId)
        }
      })
      if (id.length > 1) {
        base = id.reduce((x, y) => {
          return x + ',' + y
        })
      } else {
        base = id[0]
      }
      return base
    },
    skuGroupIdsList () { // 被选中的商品的各个规格
      const group = []
      let base = ''
      this.list.forEach(good => {
        if (good.checked) {
          group.push(good.skuGroupIds)
        }
      })
      if (group.length > 1) {
        base = group.reduce((x, y) => {
          return x + ',' + y
        })
      } else {
        base = group[0]
      }
      return base
    },
    selectedCartId () {
      const group = []
      let base = ''
      this.list.forEach(good => {
        if (good.checked) {
          group.push(good.cartId)
        }
      })
      if (group.length > 1) {
        base = group.reduce((x, y) => {
          return x + ',' + y
        })
      } else {
        base = group[0]
      }
      return base
    },
    list () {
      return this.$store.state.app.cartGoods
    }
  },
  watch: {
    list: {
      handler (val) {
        let allChecked = true
        val.forEach(res => {
          if (!res.checked) {
            allChecked = false
          }
        })
        this.allChecked = allChecked
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    this.$store.commit('BOTTOM_NAV_INDEX', 1)
    this.getList()
    this.findCartInvalids()
  },
  created () {
    this.loadBottom = this._.debounce(this.loadmore, 50)
  },
  methods: {
    async findCartInvalids () {
      const res = await this.$http.get('/cart/findCartInvalids')
      if (res.data.success) {
        this.invalidGoods = res.data.obj || []
        const arr = []
        this.invalidGoods.forEach(res => {
          arr.push(res.cartId)
        })
        this.invalidCartIds = arr.join(',')
      }
    },
    toGoodsDetails (goodsId, cartId) {
      const arr = this.invalidCartIds.split(',')
      console.log(arr)
      if (arr.indexOf(cartId.toString()) > -1) {
        this.$toast.warning('商品已失效')
        return false
      }
      this.$router.push({
        path: '/goodsDetails',
        query: {
          goodsId
        }
      })
    },
    async getList (e) {
      const params = {
        currentPage: this.page,
        pageSize: this.rows
      }
      const res = await this.$http.get('/cart/findCartPage', { params })
      const pager = res.data.pager
      const rows = res.data.rows
      this.allLoaded = pager.currentPage === pager.totalPages
      rows.forEach(res => {
        this.$set(res, 'checked', false)
      })
      const data = e ? this.list.concat(rows) : rows
      this.$store.commit('CART_GOODS', data)
    },
    toggleChecked (item) {
      console.log('???')
      item.checked = !item.checked
    },
    toggleAllChecked () {
      this.list.forEach(res => {
        this.$set(res, 'checked', !this.allChecked)
      })
    },
    deleteCart () {
      if (this.totalNum) {
        this.showAlert = true
      }
    },
    checkOut () {
      if (this.totalNum) {
        const data = {
          goodsIds: this.goodsIdList,
          skuGroupIds: this.skuGroupIdsList,
          goodsNums: this.goodsNumList
        }
        this.$store.commit('SET_ORDER_CONFIRM_DATA', data)
        this.$router.push('/certainOrder')
      }
    },
    async deleteCertain () {
      this.showAlert = false
      const data = {
        cartIds: this.selectedCartId
      }
      const res = await this.$http.post('/cart/deleteCart', data)
      if (res.data.success) {
        this.getList()
        this.findCartInvalids()
      }
    },
    async deleteInvalid (e, id) {
      const cartIds = id || this.invalidCartIds
      const data = {
        cartIds
      }
      const res = await this.$http.post('/cart/deleteCart', data)
      if (res.data.success) {
        this.getList()
        this.findCartInvalids()
      }
    },
    decrease (item) {
      const arr = this.invalidCartIds.split(',')
      console.log(arr)
      if (arr.indexOf(item.goodsId.toString()) > -1) {
        this.$toast.warning('商品已失效')
        return false
      }

      if (item.goodsNum > 1) {
        const data = {
          cartId: item.cartId,
          cartType: 2
        }
        this.addOrDelCartNum(data)
      }
    },
    increase (item) {
      const arr = this.invalidCartIds.split(',')
      console.log(arr)
      if (arr.indexOf(item.goodsId.toString()) > -1) {
        this.$toast.warning('商品已失效')
        return false
      }

      if (this.increaseAvailable(item.goodsNum, item.goodsStock)) {
        const data = {
          cartId: item.cartId,
          cartType: 1
        }
        this.addOrDelCartNum(data)
      }
    },
    async addOrDelCartNum (data) {
      const res = await this.$http.post('/cart/addOrDelCartNum', data)
      if (res.data.success) {
        this.getList()
      }
    },
    increaseAvailable (goodsNum, goodsStock) {
      return goodsNum < goodsStock && goodsNum < 99
    },
    goodsDetail (id) {
      this.$router.push({ path: '/goodsDetails', query: { goodsId: id } })
    },
    loadmore () {
      this.page += 1
      this.getList(true)
      this.$refs.loadmore.onBottomLoaded()
    }
  }

}
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 45px;
  padding-bottom: 85px;
}
/deep/.v-footer--fixed{
  bottom: 45px!important;
  height: 40px;
  border-top: 1px solid #ccc!important;
  .v-btn{
    height: 40px!important;
  }
}
</style>
