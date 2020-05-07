<template>
  <v-bottom-sheet v-model="show">
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
    areaList: regionData
  }),
  methods: {
    emitConfirm (e) {
      this.$emit('confirm', e)
    }
  }
}
</script>

<style>

</style>
