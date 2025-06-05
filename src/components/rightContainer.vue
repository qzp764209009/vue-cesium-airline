<template>
  <div class="right-container">
    <MapLineBtns></MapLineBtns>
    <MapPointOperate></MapPointOperate>
  </div>
</template>

<script setup>
  import MapLineBtns from './mapLineBtns.vue'
  import MapPointOperate from './mapPointOperate.vue'
</script>

<style scoped lang="scss">
  .right-container {
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    display: flex;
    justify-content: space-between;
  }
</style>
