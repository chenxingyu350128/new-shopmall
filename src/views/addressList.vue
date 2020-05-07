<template>
  <div
    class="page white pb-11"
    :class="{'grey lighten-2': addressList.length}"
  >
    <iHeader @back="$router.back()" text="收货地址" />
    <div v-if="addressList.length" class="mx-2 subtitle-2">
      <v-card
        class="my-2"
        v-for="(item, i) in addressList"
        @click.native="selectAddress(item)"
        :key="i"
      >
        <div class="px-2 py-1">
          <div class="d-flex align-center justify-space-between my-2">
            <span>
              <span class="mr-2">
                收件人： <span class="ml-2">{{item.receiver}}</span>
              </span>
              <span>{{item.phone}}</span>
            </span>
            <v-btn v-if="item.defcode" rounded depressed color="primary" x-small>默认</v-btn>
          </div>
          <div class="d-flex my-2">
            <span class="nowrap mr-2">收货地址：</span>
            <span class="flex-fill">{{item.region.split('-').join('')}}{{item.address}}</span>
          </div>
          <v-divider></v-divider>
          <div class="d-flex pa-2 align-center justify-end">
            <div @click.stop="edit(item)" class="d-flex align-center">
              <v-icon class="mr-2">mdi-square-edit-outline</v-icon>
              编辑
            </div>
            <div @click.stop="preDelete(item.auId)" class="d-flex align-center ml-4">
              <v-icon class="mr-2">mdi-trash-can-outline</v-icon>
              删除
            </div>
          </div>
        </div>
      </v-card>
    </div>
    <none v-else />
    <v-footer
      v-if="addressList.length < 10"
      @click.native="add"
      fixed
      bottom
      class="pa-0"
    >
      <v-btn large color="primary" block depressed tile>添加</v-btn>
    </v-footer>
    <alertBox @cancel="showAlert=false" @certain="deleteAddress" :show="showAlert" title="是否确认删除该收货地址？" />
    <addressDetail @listChanged="listChanged" :obj="editObj" @back="showDetails=false" v-if="showDetails" />
  </div>
</template>

<script>
import iHeader from '@/components/public/header.vue'
import none from '@/components/public/none'
import alertBox from '@/components/public/alertBox.vue'
import addressDetail from '@/views/addressDetails.vue'
// import editAdr from "./editAddress.vue"
// import newAdr from "./addNewAddress.vue"
export default {
  name: 'AddressList',
  components: {
    iHeader,
    alertBox,
    none,
    addressDetail
  },
  data () {
    return {
      fromOrderCertain: false,
      editObj: null,
      showDetails: false,
      showAlert: false,
      deleteId: 0
    }
  },
  computed: {
    addressList () {
      return this.$store.state.app.addressList
    }
  },
  mounted () {
    this.fromOrderCertain = !!this.$route.query.fromOrderCertain
    // 返回标识符,
    this.$store.commit('ADDRESS_BACK_FLAG', this.fromOrderCertain)
    this.getAddressList()
  },
  methods: {
    // goBack(){
    //   this.showFlag = false;
    //   // if(this.isFrom){
    //   //   this.$router.push({
    //   //     name:'orderSure',
    //   //     params:JSON.parse(localStorage.getItem('orderQuery'))
    //   //   })
    //   // }else{
    //   //   this.$router.push('/mine')
    //   // }
    // },
    preDelete (id) {
      this.deleteId = id
      this.showAlert = true
    },
    add () {
      this.editObj = null
      this.showDetails = true
    },
    edit (item) {
      this.editObj = item
      this.showDetails = true
    },
    listChanged () {
      this.showDetails = false
      this.getAddressList()
    },
    async deleteAddress () {
      this.showAlert = false
      const data = {
        auId: this.deleteId
      }
      const res = await this.$http.post('/user/deleteAddress', data)
      if (res.data.success) {
        this.$toast.success('地址删除成功！')
        this.getAddressList()
      }
    },
    selectAddress (item) {
      if (this.fromOrderCertain) {
        this.$store.commit('SELECT_ADDRESS_FOR_ORDER', item)
        this.$router.back()
      }
    },
    async getAddressList () {
      const res = await this.$http.get('/user/getAddressList')
      if (res.data.success) {
        const data = res.data.obj
        this.$store.commit('SET_ADDRESS_LIST', data)
      }
    },
    openConfirm (id) {
      console.log('/mmm')
		  this.$messagebox.confirm('确认删除此收货地址吗?')
		  .then(() => {
      		// 传id，然后刷新
          const data = {
            auId: id
          }
          this.$http.post('/user/deleteAddress', data)
            .then(res => {
              this.$toast({ message: res.data.msg })
              this.getAddressList()
            }).catch(err => {
              console.log(err)
            })
	  		}
	  	)
    },
    setDefault (id, code) {
      // 设置默认地址
      if (!code) {
        const params = {
          userId: this.$store.state.app.userInfo.userId,
          auId: id
        }
        this.$http.post('/user/editDefaultAddress', params).then(res => {
          if (res.data.code === '2000') {
            this.getAddressList()
          } else {
            this.$toast({ message: res.data.msg })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    editShow (item) {
      this.addressItem = item
      this.showDetails = true
      // setTimeout ( ()=>{
      // 	this.$refs.edit.show()
      // }, 800)
    },
    newAddress () {
      this.addressItem = null
      this.showDetails = true
      // setTimeout (()=>{
      // 	this.$refs.newEdit.show()
      // }, 500)
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
