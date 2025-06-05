<template>
  <div
    @mouseenter="isCustomCursor = true"
    @mouseleave="isCustomCursor = false"
    @mousemove="updateCursorPosition"
    class="cesiumContainer"
    :class="operateType && 'none-cursor'"
  >
    <el-icon
      class="custom-cursor"
      :class="{ active: isCustomCursor }"
      :style="cursorStyle"
      v-if="operateType"
    >
      <Plus />
    </el-icon>
    <div class="mapContainer" ref="mapContainer" id="mapContainer"></div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useMapStore } from '@/stores/map'
  import { storeToRefs } from 'pinia'
  import cesiumManager from '@/utils/CesiumManager'
  import { useMapCursorHooks } from './hooks/useMapCursorHooks'
  import { usePointHooks } from './hooks/usePointHooks'
  import { Cartesian3, CallbackProperty, StripeMaterialProperty } from 'cesium'

  // 修改图标
  const mapStore = useMapStore()
  const { isCustomCursor, updateCursorPosition, cursorStyle, operateType } = useMapCursorHooks()
  const { pointOption, stripeMaterialPropertyOption, polylineOption } = usePointHooks()
  const { setEntitiesPointOption, setCurrPointInfo, setCesiumManagerInfo } = mapStore
  const { cesiumManagerInfo } = storeToRefs(mapStore)

  const mapContainer = ref(null)
  // 新增点位
  const addEntity = async (position) => {
    const { longitude, latitude, height } = position
    await cesiumManager.addEntity(
      {
        position: Cartesian3.fromDegrees(longitude, latitude, height),
        ...pointOption(cesiumManager.entitiesPointOptions.length + 1),
        polyline: {
          positions: new CallbackProperty(() => {
            return [
              Cartesian3.fromDegrees(longitude, latitude, 0),
              Cartesian3.fromDegrees(longitude, latitude, height),
            ]
          }, false),
          material: new StripeMaterialProperty({ ...stripeMaterialPropertyOption }),
          width: 5,
        },
      },
      'point'
    )
  }

  // 新增点位连线
  const addEntityLine = () => {
    if (cesiumManager.entitiesPointOptions && cesiumManager.entitiesPointOptions.length > 1) {
      const positions = cesiumManager.entitiesPointOptions.map((item) => {
        return item.position
      })
      let polyline = cesiumManager.addEntity({
        polyline: {
          positions,
          ...polylineOption,
        },
      })
      cesiumManager.viewer.zoomTo(polyline)
    }
  }
  // 新增点位视锥体
  const addFrustum = (position) => {
    cesiumManager.addFrustum(position)
  }
  onMounted(async () => {
    await cesiumManager.init(mapContainer.value)

    // 初始相机位置
    await cesiumManager.flyTo({
      longitude: 116.4,
      latitude: 39.9,
      height: 500,
    })

    // 添加点击监听
    cesiumManager.on('click', async (e) => {
      if (operateType.value) {
        switch (operateType.value) {
          case 'point':
            let { longitude, latitude, height } = e
            height <= 0 ? (height = 200) : (height = height)
            const position = { longitude, latitude, height }
            // Cartesian3.fromDegrees(longitude, latitude, height)
            // 新增点位
            await addEntity(position)
            // 新增多点位连线
            await addEntityLine()
            // 新增点位视锥体
            await addFrustum(position)
            cesiumManager.flyTo({ longitude, latitude, height: height + 800 })
            // 存储所有点位信息
            await setEntitiesPointOption(cesiumManager.entitiesPointOptions)
            // 存储当前真实点位信息
            await setCurrPointInfo(
              cesiumManager.entitiesPointOptions[cesiumManager.entitiesPointOptions.length - 1]
            )
            break
          default:
            break
        }
      }
    })
    setCesiumManagerInfo(cesiumManager)
  })

  onUnmounted(() => {
    cesiumManager.destroy()
  })
</script>

<style scoped lang="scss">
  .cesiumContainer {
    width: 100vw;
    height: 100vh;
    position: relative;
    .mapContainer {
      width: 100%;
      height: 100%;
    }
    .custom-cursor {
      position: fixed;
      font-size: 30px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.5);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.2s;
      // color: rgb(29, 168, 203);
    }

    .custom-cursor.active {
      opacity: 1;
    }
  }
  .none-cursor {
    cursor: none;
  }
</style>
