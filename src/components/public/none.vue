<template lang="html">
    <div class="d-flex flex-column align-center">
      <img style="width: 200px; height: 120px" src="@/assets/img/none.jpg" alt="">
      <span class="mt-2 primary--text caption">{{text}}</span>
    </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '什么都没有~~'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
