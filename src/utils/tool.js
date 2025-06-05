import { BASE_FOVBYMAP, MAX_ZOOM } from "./contants";

// 计算当前FOV
export const calculateFov = (zoomLevel) => {
  // 确保zoomLevel在有效范围内
  const clampedZoom = Math.max(1, Math.min(zoomLevel, MAX_ZOOM));

  // FOV与变焦倍数成反比
  return BASE_FOVBYMAP / clampedZoom;
}

export function debounce(fn, delay) {
  // 定时器，用来 setTimeout
  var timer
  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function () {
    // 保存函数调用时的上下文和参数，传递给 fn
    const [context, args] = [this, arguments]
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer)
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}