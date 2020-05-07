<!-- navBar -->
<template>
  <v-card
    class="header-cpnt"
    dark
    flat
    tile
    :color="bgc"
  >
    <div class="wrap d-flex align-center justify-space-between">
      <div
        class="left"
        @click="$emit('back')"
      >
        <v-icon large>
          mdi-chevron-left
        </v-icon>
      </div>
      <div class="d-flex flex-fill justify-center subtitle-1 mx-12">
        <!-- 针对中部复杂化的情况，使用slot则不使用props中的text -->
        <slot name="center" />
        {{ text }}
      </div>
      <div
        class="subtitle-2 text-center v-rating fill-height d-flex align-center justify-end right"
        :class="{'rightIcon': !rightText}"
        @click="$emit('right')"
      >
        <slot name="right" />
        {{ rightText }}
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'IHeader',
  props: {
    text: {
      type: String,
      default () {
        return ''
      }
    },
    rightText: {
      type: String,
      default () {
        return ''
      }
    },
    bgc: {
      type: String,
      default () {
        return '#e3393c'
      }
    },
    hideRef: {
      type: Boolean,
      default () {
        return false
      }
    }
  }
}

</script>
<style lang='scss' scoped>
  .header-cpnt{
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    >div{
      height: 45px;
      box-sizing: border-box;
    }
   .xiyu{
     font-size: 30px;
   }
   .wrap{
     position: relative;
     .left,
     .right{
       position: absolute;
     }
     .right{
       right: 8px
     }
     .rightIcon{
       right: 0;
     }
   }
  }
</style>
