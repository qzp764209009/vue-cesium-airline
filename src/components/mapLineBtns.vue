<template>
  <div class="map-line-btn">
    <el-tooltip effect="dark" content="鼠标添加航点" placement="left">
      <div
        class="icon"
        :class="operateType === 'point' && 'active'"
        @click="setOperateType('point')"
      >
        <el-icon><TrendCharts /></el-icon>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup>
  import { useMapStore } from '@/stores/map'
  import { storeToRefs } from 'pinia'

  const mapStore = useMapStore()

  // 直接解构会失去响应性，使用 storeToRefs
  const { operateType } = storeToRefs(mapStore)
  const { setOperateType } = mapStore
</script>

<style scoped lang="scss">
  .map-line-btn {
    width: 40px;
    height: auto;
    padding: 10px 0;

    .icon {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 4px;
      color: white;
      cursor: pointer;
      font-size: 24px;

      &:hover {
        background: rgba(0, 0, 0, 0.9);
      }
    }
    .active {
      background-color: rgb(43, 133, 228);
      &:hover {
        background-color: rgb(43, 133, 228);
      }
    }
  }
</style>
