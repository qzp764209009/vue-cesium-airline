import { useMapStore } from '@/stores/map'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

export function useMapCursorHooks() {

  const mapStore = useMapStore()
  // 直接解构会失去响应性，使用 storeToRefs
  const { operateType } = storeToRefs(mapStore)
  const isCustomCursor = ref(false)
  const cursorPosition = ref({ x: 0, y: 0 })
  const updateCursorPosition = (e) => {
    cursorPosition.value = {
      x: e.clientX,
      y: e.clientY,
    }
  }

  const cursorStyle = computed(() => ({
    left: `${cursorPosition.value.x}px`,
    top: `${cursorPosition.value.y}px`,
  }))

  return { isCustomCursor, cursorStyle, operateType, updateCursorPosition }
}