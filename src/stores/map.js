import { defineStore } from 'pinia'
import { ref } from "vue";

// 使用选项式 API 风格
export const useMapStore = defineStore('map', () => {
  const operateType = ref('');
  const setOperateType = (val) => {
    console.log(operateType.value === val, operateType.value, val, 'operateType.valueoperateType.value')
    if (operateType.value && operateType.value === val) {
      operateType.value = ''
    } else {
      operateType.value = val
    }
  }
  return { operateType, setOperateType }
})