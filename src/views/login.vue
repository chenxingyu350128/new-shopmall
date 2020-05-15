<template lang="html">
  <div class="page white mx-6 d-flex flex-column">
    <div class="logo-wrap d-flex white">
      <img src="@/assets/img/login.png" alt="alt">
    </div>
    <!-- 中间 -->
    <div>
      <v-text-field
        v-model="tel"
        placeholder="请输入手机号"
        rounded
        prepend-inner-icon="mdi-cellphone-iphone"
        color="pink lighten-2"
        dense
        type="number"
        outlined
        class="mb-4"
      >
      </v-text-field>
      <v-text-field
        v-if="msgLogin"
        v-model="vCode"
        placeholder="请输入验证码"
        rounded
        prepend-inner-icon="mdi-lock-open-outline"
        color="pink lighten-2"
        dense
        type="number"
        outlined
        @keyup.enter="login"
        class="mb-4"
      >
        <template v-slot:append>
          <v-btn v-show="seconds" color="primary" outlined rounded depressed small>{{seconds}}s</v-btn>
          <span @click="getVerifyCode" v-show="!seconds" class="primary--text caption nowrap">发送验证码</span>
        </template>
      </v-text-field>
      <v-text-field
        v-else
        v-model="password"
        placeholder="请输入密码"
        rounded
        prepend-inner-icon="mdi-lock-open-outline"
        color="pink lighten-2"
        dense
        outlined
        @keyup.enter="login"
        type="password"
        class="mb-4"
      >
        <template v-slot:append>
          <span class="primary--text caption nowrap">忘记密码</span>
        </template>
      </v-text-field>
      <v-btn @click="login" class="body-1" color="primary" dark block rounded depressed>登 陆</v-btn>
      <v-subheader @click="msgLogin = !msgLogin" class="primary--text">{{msgLogin ? '账号密码登录' : '短信验证码登录'}}</v-subheader>
    </div>
    <!-- 微信登陆 -->
    <div class="flex-fill d-flex align-end">
      <div class="d-flex flex-column align-center full-width">
        <!-- <div class="d-flex align-center my-4 full-width">
          <v-divider class="flex-fill"></v-divider>
          <span class="caption mx-6">其他登陆方式</span>
          <v-divider class="flex-fill"></v-divider>
        </div>
        <v-icon color="#1aad19" size="75">mdi-wechat</v-icon>
        <span class="body-2">微信登陆</span> -->
        <span class="my-8 caption">
          登录即代表您已同意
          <span @click="toProtocol" class="primary--text">颐纳福隐私政策</span>
        </span>
      </div>
    </div>
  </div>

</template>
<script>

export default {
  name: 'Login',
  data () {
    return {
      tel: '',
      vCode: '',
      password: '',
      seconds: 0,
      fromOrderCertain: false,
      innerText: '获取验证码',
      msgLogin: true
    }
  },
  computed: {
    origin () {
      return this.$store.state.app.origin
    }
  },
  created () {
    if (this.env === 'app') {
      this.$store.commit('SET_ORIGIN', 'ORIGIN001')
      this.$store.commit('SET_ENV', 'app')
      return false
    }
    // app 不会进入该界面
    if (this.isWeChat()) { // 微信端
      this.$store.commit('SET_ORIGIN', 'ORIGIN002')
      this.$store.commit('SET_ENV', 'weChat')
    } else { // H5
      this.$store.commit('SET_ORIGIN', 'ORIGIN003')
      this.$store.commit('SET_ENV', 'h5')
    }
  },
  mounted () {
    if (this.$route.query.fromOrderCertain) {
      this.fromOrderCertain = true
    }
    const token1 = window.location.hash.split('token=')[1]
    const token2 = window.location.search.split('token=')[1]
    const token = token1 || token2
    if (token && (token !== 'null')) {
      this.$http.get('/user/getUser',
        {
          headers: {
            token: token
          }
        }).then(res => {
        if (res.data.code === '2000') {
          this.$store.commit('SET_EACH_USER_INFO', res.data.obj)
          this.$router.replace('/Index')
        }
      })
    }
  },
  methods: {
    isWeChat () {
      const ua = window.navigator.userAgent.toLowerCase()
      return ua.indexOf('micromessenger') > -1
    },
    checkPhone (e) {
      return /^1[3456789]\d{9}$/.test(e)
    },
    checkpwd (e) {
      return /^(\w){6,20}$/.test(e)
    },
    login () {
      const vertify = [
        {
          state: !this.tel,
          tip: '请输入手机号码'
        },
        {
          state: !this.checkPhone(this.tel),
          tip: '手机号码格式错误'
        }
      ]
      if (this.msgLogin) {
        vertify.concat([
          {
            state: !this.vCode,
            tip: '请输入短信验证码'
          }
        ])
      } else {
        vertify.concat([
          {
            state: !this.password,
            tip: '请输入密码'
          },
          {
            state: !this.checkpwd(this.password),
            tip: '密码输入有误，密码不小于6位数，勿用非法字符'
          }
        ])
      }
      // 遍历
      let checked = true
      vertify.some(res => {
        if (res.state) {
          this.$toast.warning(res.tip)
          checked = false
          return true
        }
      })
      if (!checked) {
        return
      }
      // 表单验证通过
      const origin = this.msgLogin ? this.origin : 'ORIGIN004'
      const data = {
        origin,
        userName: this.tel
      }
      if (this.msgLogin) { // 验证码登录
        data.code = this.vCode
      } else {
        data.password = this.password
      }

      if (origin === 'ORIGIN001') {
        data.userName = this.tel
        data.code = this.vCode
      }
      console.log(data)
      this.$http.post('/user/login', data)
        .then(res => {
          if (res.data.success) {
            if (origin === 'ORIGIN002') { // 微信客户端
              location.href = res.data.obj.url
              return false
            }

            this.$toast('登录成功', {
              y: 'top',
              color: 'success'
            })
            this.$store.commit('SET_EACH_USER_INFO', res.data.obj)
            const redirectPath = this.fromOrderCertain ? '/certainOrder' : '/index'
            this.$router.replace(redirectPath)
          }
        })
    },
    getVerifyCode () {
      if (!this.tel) {
        this.$toast.warning('请填写手机号码')
        return
      }

      if (!this.checkPhone(this.tel)) {
        this.$toast.warning('手机号格式有误，请重新输入')
        return
      }
      const params = {
        phone: this.tel
      }
      this.$http.get('/goods/getMobileCode', { params })
        .then(res => {
          if (res.data.success) {
            this.$toast('验证码发送成功')
            this.seconds = 60
            const timer = setInterval(() => {
              this.seconds--
              if (this.seconds === 0) {
                clearInterval(timer)
              }
            }, 1000)
          }
        })
    },
    toProtocol () {
      location.href = 'http://mobile.yinaf.com/page/agreement.html'
    }
  }
}

</script>
<style lang="scss" scoped>
.page{
  height: 100vh;
  overflow: hidden;
  .logo-wrap{
    height: 60vw;
    >img{
      margin: auto;
      width: 80px;
      height: 55px;
    }
  }
}
/deep/ .v-text-field__details{
  display: none!important;
}
.nowrap{
  white-space: nowrap;
}
</style>
