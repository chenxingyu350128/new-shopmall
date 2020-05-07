<template lang="html">
  <!-- 留言  -->
  <section :class="$style.content">
    <div :class="$style.icon">
      <i class="icon_message" />
    </div>
    <ul :class="$style.text">
      <li>买家留言：快点快点快点</li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" module>
@import "@/assets/css/common.scss";
.content{
	@include list;
	.text{
		flex: 84%;
	}
	.icon{
		text-align: center;
		i{
			vertical-align: -8px;
		}
	}
}
</style>
