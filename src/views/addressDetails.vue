<template>
  <div class="page white">
    <iHeader @back="$emit('back')" :text="auId?'编辑收货地址':'添加收货地址'" />
    <div class="mx-4 subtitle-2 my-2">
      <v-text-field
        v-model="receiver"
        height="45"
        prefix="收件人"
        placeholder="请输入收货人名称"
      ></v-text-field>
      <v-text-field
        v-model="phone"
        height="45"
        prefix="联系电话"
        type="number"
        placeholder="请输入手机号码"
      ></v-text-field>
      <v-text-field
        v-model="region"
        readonly
        height="45"
        @click="showRegionPicker=true"
        prefix="所在地"
        placeholder="请选择所在地区"
        append-icon="mdi-chevron-right"
      ></v-text-field>
      <v-textarea
        v-model="address"
        class="px-0"
        prefix="详细地址"
        placeholder="请填写详细地址"
        rows="2"
        auto-grow
      ></v-textarea>
      <v-text-field
        v-model="zipcode"
        height="45"
        prefix="邮编地址"
        type="number"
        placeholder="请输入邮编地址"
      ></v-text-field>
      <div class="pa-2 d-flex align-center justify-space-between">
        <span>设为默认地址：</span>
        <v-switch v-model="defcode" dense></v-switch>
      </div>
    </div>
    <v-footer fixed bottom class="pa-0 white">
      <v-btn @click="commit" color="primary" block large depressed tile>{{auId?'修改':'添加'}}</v-btn>
    </v-footer>
    <regionPicker @cancel="showRegionPicker=false" @confirm="onRegionConfirm($event)" :show="showRegionPicker" />
  </div>

</template>

<script>
import iHeader from '@/components/public/header'
import regionPicker from '@/components/public/regionPicker'
export default {
  name: 'EditOrAddAddress',
  components: {
    iHeader,
    regionPicker
  },
  props: {
    obj: {
      type: Object,
      required: false
    }
  },
  data: () => ({
    address: '',
    auId: 0,
    defcode: 0,
    phone: '',
    receiver: '',
    region: '',
    zipcode: '',
    showRegionPicker: false
  }),
  computed: {
    isDefault () {
      return !!this.defcode
    }
  },
  mounted () {
    if (this.obj) {
      this.getAddressDetail()
    }
  },
  methods: {
    async getAddressDetail () {
      for (const x in this.obj) {
        this[x] = this.obj[x]
        this.defcode = Boolean(this.defcode)
      }
    },
    onRegionConfirm (e) {
      this.showRegionPicker = false
      const regionArr = e.map(res => res.name)
      this.region = regionArr.join('-')
    },
    checkPhone (e) {
      return /^1[3456789]\d{9}$/.test(e)
    },
    async commit () {
      let commitInvalid = false
      let url = '/user/addAddress'
      const arr = [
        {
          state: !this.receiver,
          tip: '请输入收件人'
        },
        {
          state: !this.phone,
          tip: '请输入收件人手机号'
        },
        {
          state: !this.checkPhone(this.phone),
          tip: '手机号格式错误，请重试'
        },
        {
          state: !this.region,
          tip: '请选择所在地区'
        },
        {
          state: !this.address,
          tip: '请输入详细地址'
        }
      ]
      arr.some(res => {
        if (res.state) {
          this.$toast(res.tip, {
            y: 'top',
            color: 'warning'
          })
          commitInvalid = true
          return true
        }
      })
      if (commitInvalid) {
        return false
      }
      // 表单验证pass
      const data = {
        receiver: this.receiver,
        phone: this.phone,
        region: this.region,
        address: this.address,
        defcode: Number(this.defcode)
      }
      if (this.zipcode) {
        data.zipcode = this.zipcode
      }
      if (this.auId) {
        data.auId = this.auId
        url = '/user/editAddress'
      }
      const res = await this.$http.post(url, data)
      if (res.data.success) {
        this.$emit('listChanged')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 6;
  }
  /deep/ .v-text-field{
    margin: 0;
    padding-top: 0;
    font-size: .875rem!important;
    font-weight: 500;
    letter-spacing: .0071428571em!important;
    line-height: 1.375rem;
    font-family: Roboto,sans-serif!important;
    .v-input__append-inner{
      align-self: unset!important;
    }
    .v-text-field__details{
      display: none;
    }
  }
  /deep/.v-input__slot{
    display: flex!important;
    align-items: center!important;
    margin-bottom: 0;
    padding: 0!important;
    textarea,
    input{
      text-align: right;
    }
  }
  /deep/ .v-text-field__slot{
    padding: 0 8px;
  }
  /deep/.v-textarea{
    .v-text-field__slot{
      padding: 4px;
      >*{
        margin-top: 0!important;
      }
    }
  }
</style>
