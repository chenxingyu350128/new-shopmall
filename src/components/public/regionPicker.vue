<template>
  <v-bottom-sheet persistent v-model="isShow">
    <van-area @cancel="$emit('cancel')" @confirm="emitConfirm($event)" :area-list="areaList" />
  </v-bottom-sheet>
</template>

<script>
import regionData from '@/util/area.js'
export default {
  name: 'regionPicker',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    areaList: regionData,
    isShow: false
  }),
  watch: {
    show: {
      handler (val) {
        this.isShow = val
      },
      immediate: true
    }
  },
  methods: {
    emitConfirm (e) {
      this.$emit('confirm', e)
    }
  }
}
</script>

<style>

</style>
