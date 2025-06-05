<template>
  <div class="map-point-operate">
    <el-descriptions title="航点列表"> </el-descriptions>
    <div v-if="entitiesPointOption && entitiesPointOption.length" class="point-item-list">
      <div
        class="point-item"
        v-for="item in entitiesPointOption"
        :key="item.pointInfo.id"
        @click="selectPoint(item)"
        :class="
          currPointInfo &&
          currPointInfo.pointInfo &&
          currPointInfo.pointInfo.id === item.pointInfo.id &&
          'active-item'
        "
      >
        <el-icon class="icon-orange"><Location /></el-icon>
        <span>{{ item.pointInfo.id }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useMapStore } from '@/stores/map'
  import { storeToRefs } from 'pinia'
  import { debounce } from '@/utils/tool'

  const mapStore = useMapStore()

  console.log(mapStore, 'mapStoremapStore')
  // 直接解构会失去响应性，使用 storeToRefs
  const { entitiesPointOption, currPointInfo, cesiumManagerInfo } = storeToRefs(mapStore)
  const { setCurrPointInfo } = mapStore
  // 选中航点
  const selectPoint = debounce((item) => {
    setCurrPointInfo(item)
    cesiumManagerInfo.value.addFrustum(item.pointInfo)
  }, 500)

  watch(
    () => entitiesPointOption.value,
    (val) => {
      console.log(val, 'val数据更新')
    }
  )
</script>

<style scoped lang="scss">
  .map-point-operate {
    width: 350px;
    height: 100vh;
    background: rgba(29, 30, 31, 0.9);
    color: #fff;
    padding: 20px;
    box-sizing: border-box;
    ::v-deep(.el-descriptions__title) {
      color: #fff;
    }
    ::v-deep(.el-collapse-item__header) {
      padding: 0 12px;
    }
    ::v-deep(.el-descriptions__header) {
      margin-bottom: 0;
    }
    .point-item-list {
      width: 310px;
      .point-item {
        cursor: pointer;
        width: 100%;
        padding: 12px;
        background-color: rgb(69, 73, 74);
        margin-top: 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .icon-orange {
          color: orange;
          margin-right: 4px;
        }
        &:hover {
          background-color: rgb(154, 162, 164);
        }
      }
      .active-item {
        background-color: rgb(154, 162, 164);
      }
    }
  }
</style>
