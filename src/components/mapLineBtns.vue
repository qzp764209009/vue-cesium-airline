<template>
  <div class="line-btns">
    <MapBtnBase content="鼠标添加航点" operateTypeProps="point">
      <el-icon><TrendCharts /></el-icon>
    </MapBtnBase>
    <MapBtnBase content="飞行偏航角" operateTypeProps="heading">
      <el-icon><Position /></el-icon>
    </MapBtnBase>
  </div>
</template>

<script setup>
  import { useMapStore } from '@/stores/map'
  import { storeToRefs } from 'pinia'
  import MapBtnBase from './mapBtnBase.vue'

  const mapStore = useMapStore()

  // 直接解构会失去响应性，使用 storeToRefs
  const { operateType } = storeToRefs(mapStore)
  const { setOperateType } = mapStore
</script>

<style scoped lang="scss">
  .line-btns {
    display: flex;
    flex-direction: column;
  }
</style>
