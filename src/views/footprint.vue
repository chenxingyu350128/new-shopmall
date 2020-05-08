<template>
  <div class="page pb-11">
    <iHeader @back="$router.back()" text="我的足迹" @right="editFlag=!editFlag" :rightText="editFlag?'完成':'编辑'" />
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
        <div v-if="editFlag" class="d-flex align-center">
          <v-icon
            dense
            :color="item.checked?'primary':'grey lighten-2'"
          >
            {{item.checked?'mdi-check-circle':'mdi-circle-outline'}}
          </v-icon>
        </div>
        <div class="ml-2 flex-fill d-flex">
          <v-avatar
            size="65"
            tile
            class="mr-2"
            @click.stop="goodsDetail(item.goodsId)"
          >
            <img :src="item.goodsImg">
          </v-avatar>
          <div class="flex-fill d-flex flex-column justify-space-between">
            <div class="subtitle-2">
              {{item.goodsName}}
            </div>
            <div class="d-flex pr-2 align-center justify-space-between">
              <span class="subtitle-1 primary--text">￥{{item.goodsPrice}}</span>
            </div>
          </div>
        </div>
      </v-card>
    </van-list>
    <!-- 删除底栏 -->
    <v-footer v-if="editFlag && list.length" fixed bottom class="pa-0 white flex-column">
      <v-divider class="full-width"></v-divider>
      <div class="full-width d-flex justify-space-between">
        <div class="d-flex align-end pa-1">
          <v-icon
            @click="toggleAllChecked"
            :color="this.allChecked?'primary':'grey lighten-2'"
          >
            {{this.allChecked?'mdi-check-circle':'mdi-circle-outline'}}
          </v-icon>
          <span class="caption">全选</span>
        </div>
        <v-btn @click="deleteFollow" class="height-fill" depressed tile dark color="primary">删除</v-btn>
      </div>
    </v-footer>
    <recommendGoods />
    <alertBox :show="showAlert" @cancel="showAlert=false" @certain="deleteCertain" title="是否确认删除选中的商品？" />
  </div>
</template>

<script>
import iHeader from '@/components/public/header'
import recommendGoods from '@/components/public/recommendGoods'
import alertBox from '@/components/public/alertBox'

export default {
  name: 'followGoodsList',
  components: {
    iHeader,
    recommendGoods,
    alertBox
  },
  data () {
    return {
      list: [],
      editFlag: false,
      showAlert: false,
      allChecked: false,
      page: 1,
      rows: 10,
      allLoaded: false
    }
  },
  computed: {
    goodsIdList () { // 被选中的商品的各个id
      const id = []
      let base = ''
      this.list.forEach(good => {
        if (good.checked) {
          id.push(good.tracksId)
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
  created () {
    this.loadBottom = this._.debounce(this.loadmore, 50)
  },
  mounted () {
    this.getList()
  },
  methods: {
    async getList (e) {
      const params = {
        pageSize: this.rows,
        currentPage: this.page
      }
      const res = await this.$http.get('/user/findGoodsTracksPage', { params })
      if (res.data.success) {
        const pager = res.data.pager
        const rows = res.data.rows
        rows.forEach(res => {
          this.$set(res, 'checked', false)
        })
        this.allLoaded = pager.currentPage === pager.totalPages
        this.list = e ? this.list.concat(rows) : rows
      }
    },
    goodsDetail (goodsId) {
      this.$router.push({
        path: '/goodsDetails',
        query: {
          goodsId
        }
      })
    },
    toggleChecked (item) {
      item.checked = !item.checked
    },
    toggleAllChecked () {
      this.list.forEach(res => {
        this.$set(res, 'checked', !this.allChecked)
      })
    },
    deleteFollow () {
      if (this.goodsIdList) {
        this.showAlert = true
      }
    },
    async deleteCertain () {
      this.showAlert = false
      const data = {
        tracksIds: this.goodsIdList
      }
      const res = await this.$http.post('/user/deleteGoodsTracks', data)
      if (res.data.success) {
        this.$toast.success('删除成功')
        this.page = 1
        this.getList()
      }
    },
    loadmore () {
      this.page++
      this.getList(true)
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
