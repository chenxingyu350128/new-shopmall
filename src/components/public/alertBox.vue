<template>
  <v-dialog v-model="show" persistent class="alertBox-cpnt" max-width="290">
    <v-card class="pa-2">
      <v-card-text class="d-flex flex-column align-center py-2">
        <img class="alertBoxImage" src="@/assets/img/innerDialog.png" />
        <span class="pt-2">{{ title }}</span>
      </v-card-text>
      <v-card-actions class="d-flex">
        <v-btn
          depressed
          dark
          outlined
          class="flex-fill"
          color="primary"
          @click="$emit('cancel')"
        >
          取消
        </v-btn>
        <v-btn
          depressed
          dark
          class="flex-fill "
          color="primary"
          @click="$emit('certain')"
        >
          确定
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
.alertBox-cpnt {
  z-index: 9999;
}
/deep/ .v-card__text {
  .alertBoxImage {
    width: 83px !important;
    height: 59px !important;
    margin: auto;
  }
}
</style>
