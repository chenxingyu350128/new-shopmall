<template lang="html">
  <div
    v-show="flag>420"
    class="content"
  >
    <a
      class="img"
      @click="toTop"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      flag: false
    }
  },
  mounted () {
    const _this = this
    window.addEventListener('scroll', function () {
		  console.log(document.documentElement.scrollTop)
      	 _this.flag = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    	})
  },
  methods: {
    toTop () {
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
	position: fixed;
	right: .3rem;
	bottom: 1.333rem  /* 100/75 */;
	z-index: 999999;
	.img{
		display: block;
    cursor: pointer;
		width: 50px;
		height: 50px;
		background: url('/@/assets/top_active.png') no-repeat;
		background-size: 100%;
	}
}
</style>
