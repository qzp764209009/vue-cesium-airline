import { BASE_FOVBYMAP, MAX_ZOOM } from "./contants";

// 计算当前FOV
export const calculateFov = (zoomLevel) => {
  // 确保zoomLevel在有效范围内
  const clampedZoom = Math.max(1, Math.min(zoomLevel, MAX_ZOOM));

  // FOV与变焦倍数成反比
  return BASE_FOVBYMAP / clampedZoom;
}