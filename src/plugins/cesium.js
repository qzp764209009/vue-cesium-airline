import cesiumManager from '@/utils/CesiumManager'

export default {
  install: (app) => {
    app.config.globalProperties.$cesium = cesiumManager
    app.provide('cesium', cesiumManager)
  }
}