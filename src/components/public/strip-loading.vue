<template>
  <ul class="strip-loading flex-ct-x">
    <li
      v-for="v in 6"
      :key="v"
      :style="`--line-index: ${v}`"
    />
  </ul>
</template>

<style lang="scss" scoped>
.strip-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 0;
  transform: translate(-50%, -50%);
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  li {
    --time: calc((var(--line-index) - 1) * 200ms);
    border-radius: 3px;
    width: 5px;
    height: 20px;
    background-color: #f66;
    animation: beat 1s ease-in-out var(--time) infinite;
    & + li {
      margin-left: 3px;
    }
  }
}
@keyframes beat {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(.5);
  }
}
</style>

<script>
export default {
  name: 'StripLoading'
}
</script>
