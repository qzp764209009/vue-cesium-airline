import { defineStore } from 'pinia'
import { ref } from "vue";

// 使用选项式 API 风格
export const useMapStore = defineStore('map', () => {
  // 地图单例存储
  const cesiumManagerInfo = ref();
  // 操作类型
  const operateType = ref('');
  // 航点点位数组
  const entitiesPointOption = ref([])
  // 当前选中航点信息
  const currPointInfo = ref([])
  const setOperateType = (val) => {
    if (operateType.value && operateType.value === val) {
      operateType.value = ''
    } else {
      operateType.value = val
    }
  }
  const setEntitiesPointOption = (val) => {
    console.log('entitiesPointOption数据更新')
    entitiesPointOption.value = [...val];
  }
  const setCurrPointInfo = (val) => {
    currPointInfo.value = val;
  }
  const setCesiumManagerInfo = (val) => {
    cesiumManagerInfo.value = val;
  }
  return { cesiumManagerInfo, operateType, setOperateType, entitiesPointOption, setEntitiesPointOption, currPointInfo, setCurrPointInfo, setCesiumManagerInfo }
})