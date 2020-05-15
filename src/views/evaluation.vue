<template>
  <div class="page grey lighten-3">
    <iHeader class="iHeader" @back="$emit('hide')" text="商品评价" />
    <div>
      <!-- 商品 -->
      <div v-for="(item, i) in orderGoodsList" :key="i" class="white pa-2 mb-2">
        <div class="d-flex align-center mb-2">

          <v-avatar
            size="75"
            tile
          >
            <img :src="item.goodsImg">
          </v-avatar>
          <div class="ml-4 flex-fill d-flex align-center caption justify-space-between">
            <span>描述相符</span>
            <v-rating color="yellow" background-color="yellow" dense small v-model="item.eval"></v-rating>
            <span>{{evalText[item.eval - 1]}}</span>
          </div>
        </div>
        <v-textarea class="subtitle-2" auto-grow rows="3" outlined v-model="item.content" placeholder="宝贝满足你的期待吗？说说它的优点和美中不足的地方吧"></v-textarea>
        <div class="d-flex">
          <div
            v-if="item.images.length<4"
            class="add"
          >
            <!-- <div style="white-spacing: no-wrap">点击上传</div> -->
            <label class="bg">
              <input
                type="file"
                style="display: none"
                ref="imgInput"
                class="input-file"
                name="avatar"
                accept="image/gif,image/jpeg,image/jpg,image/png"
                @change="selectImage($event, item)"
              >
              <v-avatar
                size="65"
                tile
              >
                <img :src="require('@/assets/img/upload.png')">
              </v-avatar>
            </label>
          </div>
          <div v-if="item.images.length" class="flex-fill d-flex justify-space-around">
            <div
              v-for="(x, idx) in item.images"
              :key="idx"
              class="uploadPic"
            >
              <v-avatar
                size="65"
                tile
                @click="visualClick(idx, item, i)"
              >
                <img :src="x">
              </v-avatar>
              <v-icon @click="deleteImg(idx, item)" dense color="primary">mdi-close-circle</v-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-footer fixed bottom class="white pa-0 justify-space-between align-center">
      <div @click="isAnonymous=!isAnonymous" class="d-flex align-center px-2">
        <v-icon dense :color="isAnonymous?'primary':'grey lighten-2'">{{isAnonymous?'mdi-check-circle':'mdi-circle-outline'}}</v-icon>
        <span class="caption ml-2">匿名</span>
      </div>
      <v-btn @click="commit" depressed large color="primary" tile>评价</v-btn>
    </v-footer>
  </div>
</template>

<script>
import iHeader from '@/components/public/header'
export default {
  name: 'Evaluation',
  components: {
    iHeader
  },
  props: {
    obj: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      evalText: ['非常差', '一般', '还不错', '很好', '非常好'],
      imgList: [],
      orderGoodsList: [],
      isAnonymous: false,
      orderId: '',
      editImageIndex: null,
      editItem: null,
      addClick: true, // 表示点击的是增加图片
      goodsIds: []
    }
  },
  computed: {
    evals () {
      const arr = []
      this.orderGoodsList.forEach(res => {
        arr.push(res.eval)
      })
      return arr
    },
    contents () {
      const arr = []
      this.orderGoodsList.forEach(res => {
        arr.push(res.content)
      })
      return arr
    },
    images () {
      const arr = []
      this.orderGoodsList.forEach(res => {
        const str = res.images.join(',')
        arr.push(str)
      })
      return arr
    }
  },
  mounted () {
    this.orderGoodsList = this.obj.orderGoodsList
    this.orderId = this.obj.orderId
    const arr = []
    this.orderGoodsList.forEach(res => {
      arr.push(res.goodsId)
      this.$set(res, 'eval', 5)
      this.$set(res, 'content', '')
      this.$set(res, 'images', [])
    })
    this.goodsIds = arr
  },
  methods: {
    selectImage (e, item) {
      console.log(e)
      const file = e.target.files[0]
      // const name = 'upload' + file.type.split('/')[1]
      const fd = new FormData()
      fd.append('file', file)
      this.$http.post('/file/fileUpload', fd)
        .then(res => {
          if (res.data.success) {
            // 改变图片
            const pic = res.data.obj.url
            if (!this.addClick) {
              console.log('tihuan')
              console.log(this.editItem)
              const arr = this.editItem.images.splice(this.editImageIndex, 1, pic)
              console.log(arr)
              // this.$set(this.editItem, 'images', arr)
              this.addClick = true // 还原
              return false
            }
            const images = item.images
            console.log(images)
            images.push(pic)
            this.$set(item, 'images', images)
          }
        })
        .then(() => {
          this.addClick = true // 还原
        })
    },
    reduceMap1 (e) {
      if (!(Array.isArray(e) && e.length) && e.every(res => { return !!res })) {
        return
      }
      return e.reduce((x, y) => {
        return x + ',' + y
      })
    },
    reduceMap2 (e) {
      if (!(Array.isArray(e) && e.length && e.every(res => !!res))) {
        return
      }
      return e.reduce((x, y) => {
        return x + '₪' + y
      })
    },
    visualClick (idx, item, i) {
      this.addClick = false
      this.editImageIndex = idx
      this.editItem = item
      this.$refs.imgInput[i].click()
    },
    deleteImg (idx, item) {
      console.log('???')
      item.images.splice(idx, 1)
      this.$set(item, 'images', item.images)
    },
    commit () {
      // 表单验证
      let available = true
      this.orderGoodsList.some(res => {
        if (!res.content) {
          available = false
          this.$toast('评价内容不得为空')
          return true
        }
      })
      // 验证失败，不能提交
      if (!available) {
        return
      }
      // 验证成功
      // 参数整合中
      const goodsIds = this.reduceMap1(this.goodsIds)
      const orderId = this.orderId
      const evals = this.reduceMap1(this.evals)
      const contents = this.reduceMap2(this.contents)
      const imgs = this.reduceMap2(this.imgs)
      const isAnonymous = Number(this.isAnonymous)
      const data = {
        goodsIds,
        orderId,
        evals,
        contents,
        imgs,
        isAnonymous
      }
      this.$http.post('/order/addEval', data)
        .then(res => {
          if (res.data.success) {
            this.$toast.success(res.data.msg)
            this.$emit('reload')
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  position: fixed;
  z-index: 999;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}
.uploadPic{
  position: relative;
  /deep/.v-icon{
    position: absolute;
    right: 0;
  }
}
/deep/.iHeader{
  z-index: 111;
}
</style>
