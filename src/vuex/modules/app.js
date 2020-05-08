import Util from '@/util/common'

const state = {
  image: Util.getLocal('image') || '',
  realName: Util.getLocal('realName') || '',
  token: Util.getLocal('token') || '',
  userId: Util.getLocal('userId') || 0,
  userName: Util.getLocal('userName') || '',
  userType: Util.getLocal('userType') || 0,
  tabbarIndex: Util.getLocal('tabbarIndex'),
  origin: Util.getLocal('origin'),
  env: Util.getLocal('env'),
  loading: !!Util.getLocal('loading'),
  // 搜索
  searchList: Util.getLocal('searchList') || [],
  current_key: Util.getLocal('current_key'),
  // 订单确认数据
  orderConfirmData: Util.getLocal('orderConfirmData'),
  newAddressData: Util.getLocal('newAddressData'),
  cartGoods: Util.getLocal('cartGoods') || [],
  addressList: Util.getLocal('addressList') || [],
  couponList: Util.getLocal('couponList') || [],
  addressBackFlag: Util.getLocal('addressBackFlag'),
  newAddress: Util.getLocal('newAddress'),
  newCoupon: Util.getLocal('newCoupon'),
  orderToPay: Util.getLocal('orderToPay') // addOrderSubmit创建订单需要的data
}

const mutations = {
  SET_LOADING: (state, res) => { // state不可或缺，不因没用到就省去
    Util.setLocal('loading', res)
    state.loading = res
  },
  SET_ORIGIN: (state, res) => {
    Util.setLocal('origin', res)
    state.loading = res
  },
  NEW_BUILD_ADDRESS: (state, res) => {
    Util.setLocal('newAddressData', res)
    state.newAddressData = res
  },
  SELECT_ADDRESS_FOR_ORDER: (state, res) => {
    Util.setLocal('newAddress', res)
    state.newAddress = res
  },
  SELECT_COUPON_FOR_ORDER: (state, res) => {
    Util.setLocal('newCoupon', res)
    state.newCoupon = res
  },
  SET_ENV: (state, res) => {
    Util.setLocal('env', res)
    state.env = res
  },
  BOTTOM_NAV_INDEX: (state, res) => {
    Util.setLocal('tabbarIndex', res)
    state.tabbarIndex = res
  },
  XHR_401: (state) => {
    const arr = [
      'image',
      'realName',
      'token',
      'userId',
      'userName',
      'userType'
    ]
    arr.forEach(res => {
      Util.clearLocal(state, res)
      state[res] = null
    })
  },
  SET_EACH_USER_INFO: (state, res) => {
    for (const x in res) {
      Util.setLocal(x, res[x])
      state[x] = res[x]
    }
    // state.loading = res
  },
  ADD_SEARCH: (state, res) => {
    console.log(state, res)
    if (state.searchList.indexOf(state, res) !== -1) {
      return
    }
    const searchList = state.searchList
    searchList.unshift(res)
    Util.setLocal('searchList', searchList)
    // console.log('res:', res)
    state.searchList = searchList
  },
  CLEAR_SEARCH: () => {
    Util.setLocal('searchList', [])
    state.searchList = []
  },
  SET_CURRENT_SEARCH: (state, res) => {
    Util.setLocal('current_key', res)
    state.current_key = res
  },
  SET_ORDER_CONFIRM_DATA: (state, res) => {
    Util.setLocal('orderConfirmData', res)
    state.orderConfirmData = res
  },
  ORDER_TO_PAY: (state, res) => {
    Util.setLocal('orderToPay', res)
    state.orderToPay = res
  },
  SET_ADDRESS_LIST: (state, res) => {
    Util.setLocal('addressList', res)
    state.addressList = res
  },
  SET_COUPON_LIST: (state, res) => {
    Util.setLocal('couponList', res)
    state.couponList = res
  },
  ADDRESS_BACK_FLAG: (state, res) => {
    Util.setLocal('addressBackFlag', res)
    state.addressBackFlag = res
  },
  CART_GOODS: (state, res) => {
    Util.setLocal('cartGoods', res)
    state.cartGoods = res
  }

}

export default {
  state,
  mutations
}
