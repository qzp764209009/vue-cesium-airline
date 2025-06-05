<template>
  <div class="line-btns">
    <MapBtnBase content="鼠标添加航点" operateTypeProps="point" @handleClick="handleClick">
      <el-icon><TrendCharts /></el-icon>
    </MapBtnBase>
    <MapBtnBase
      content="添加飞行偏航角"
      operateTypeProps="heading"
      v-if="currPointInfo"
      @handleClick="handleClick"
    >
      <el-icon><Position /></el-icon>
    </MapBtnBase>
    <MapBtnBase
      content="添加飞行俯仰角"
      operateTypeProps="pitch"
      v-if="currPointInfo"
      @handleClick="handleClick"
    >
      <el-icon><VideoCamera /></el-icon>
    </MapBtnBase>
    <MapBtnBase
      content="添加焦距"
      operateTypeProps="fov"
      v-if="currPointInfo"
      @handleClick="handleClick"
    >
      <el-icon><Camera /></el-icon>
    </MapBtnBase>
  </div>
</template>

<script setup>
  import { useMapStore } from '@/stores/map'
  import { storeToRefs } from 'pinia'
  import MapBtnBase from './mapBtnBase.vue'
  import { BASE_PITCH, BASE_FOV, BASE_HEADING } from '@/utils/contants'

  const actionBaseInfo = {
    actionType: ['heading', 'pitch', 'fov'],
  }

  const mapStore = useMapStore()

  // 直接解构会失去响应性，使用 storeToRefs
  const { operateType, currPointInfo } = storeToRefs(mapStore)
  const { setOperateType, setCurrPointInfo } = mapStore
  // 初始化操作数据
  const initActionValue = {
    heading: BASE_HEADING,
    pitch: BASE_PITCH,
    fov: BASE_FOV,
  }
  // 当前动作操作
  const handleClick = (type) => {
    // 修改操作类型
    setOperateType(type)
    console.log('type', type, actionBaseInfo.actionType.includes(type))
    if (actionBaseInfo.actionType.includes(type)) {
      // 新增航点动作调整视锥体
      let actionList = []
      if (currPointInfo.value && currPointInfo.value.actionList) {
        actionList = currPointInfo.value.actionList
      }
      // 初始化动作数据
      const currageActionitem = {
        type,
        value: initActionValue[type],
        id: actionList.length + 1,
      }

      actionList = [...actionList, currageActionitem]

      setCurrPointInfo({ ...currPointInfo.value, actionList, currageActionitem })

      console.log(currPointInfo.value, 'currPointInfo.value')
    }
  }
</script>

<style scoped lang="scss">
  .line-btns {
    display: flex;
    flex-direction: column;
  }
</style>
