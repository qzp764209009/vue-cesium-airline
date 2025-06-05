import { Viewer, Cartesian3, PerspectiveFrustum, Ion, WebMapTileServiceImageryProvider, DebugCameraPrimitive, Color, Math, Cartographic, ScreenSpaceEventType, Camera } from 'cesium'
import {
  BASE_PITCH,
  BASE_HEADING,
  BASE_ROLL,
  IDEAL_BASE_PITCH,
  BASE_FAR,
  BASE_NEAR,
  BASE_FOV,
} from './contants';

import { calculateFov } from "./tool";

export const initConfig = {
  skyBox: false, // 关闭天空盒
  skyAtmosphere: false, // 关闭大气层效果
  antialias: false, //抗锯齿
  // 禁用动画控件
  animation: false,
  // 禁用图层选择器
  baseLayerPicker: false, //为false的时候要设置默认底图

  // 禁用全屏按钮
  fullscreenButton: false,
  // 禁用地理编码器
  // 禁用主页按钮
  homeButton: false,
  // 禁用点击弹窗信息框
  infoBox: false,
  // 禁用场景模式选择器
  sceneModePicker: false,
  geocoder: false, // 显示地理编码搜索框
  locale: 'zh-CN', // 设置应用语言为中文
  // 禁用选中指示器
  selectionIndicator: false,
  // 禁用时间轴
  timeline: false,
  // 禁用导航帮助按钮
  navigationHelpButton: false,
};

class CesiumManager {
  constructor() {
    this.viewer = null
    // 实体集合
    this.entities = []
    // 实体参数集合
    this.entitiesPointOptions = []
    this._initPromise = null
    this._eventHandlers = {
      click: []
    }
    this._pickedObject = null
    // 当前地图点击点位数据
    this._clickPosition = null
    // 视锥体相机
    this.currentPrimitivesCamera = null
    // 视锥体
    this.currentPrimitive = null
  }

  // 初始化 Cesium Viewer
  init(container, options = {}) {
    if (this._initPromise) return this._initPromise
    const { VITE_CESIUM_TOKEN, VITE_CESIUM_WEB_KEY } = import.meta.env

    this._initPromise = new Promise((resolve) => {
      // 设置 Cesium Ion 令牌（从环境变量获取）
      Ion.defaultAccessToken = VITE_CESIUM_TOKEN || ''

      const imageryProvider = new WebMapTileServiceImageryProvider({
        url: `http://t0.tianditu.gov.cn/img_w/wmts?tk=${VITE_CESIUM_WEB_KEY}`, // 替换为你的天地图密钥
        layer: 'img',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'w',
        // 层级设置
        maximumLevel: 18,
        minimumLevel: 1,
        credit: '天地图',
      })

      // 加载中文注记图层
      const imageryProviderCia = new WebMapTileServiceImageryProvider({
        url: `https://t0.tianditu.gov.cn/cia_w/wmts?tk=${VITE_CESIUM_WEB_KEY}`,
        layer: 'cia',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'w',
        maximumLevel: 18,
        credit: '天地图注记',
        // 层级设置
        maximumLevel: 18,
        minimumLevel: 1
      });

      // 默认配置
      const defaultOptions = {
        imageryProvider,
        ...initConfig,
        ...options,
      }

      this.viewer = new Viewer(container, defaultOptions)
      this.viewer._cesiumWidget._creditContainer.style.display = 'none'; // 隐藏版权
      // this.viewer.navigationHelpButton.viewModel.showHelp = false; // 立即隐藏帮助面板
      // this.viewer.navigationHelpButton.destroy(); // 完全移除控件

      this.viewer.imageryLayers.addImageryProvider(imageryProvider);
      this.viewer.imageryLayers.addImageryProvider(imageryProviderCia);

      // 初始化事件监听
      this._initEventListeners()

      // 解决初始化完成
      this.viewer.scene.postRender.addEventListener(() => {
        if (this.viewer.scene.globe.tilesLoaded) {
          resolve(this.viewer)
        }
      })
    })
    this.viewer.scene.backgroundColor = Color.SKYBLUE;
    return this._initPromise
  }
  // 转化为真实点位经纬度
  conversion(cartesian) {
    const cartographic = Cartographic.fromCartesian(cartesian);
    const pointInfo = {}
    pointInfo.longitude = Math.toDegrees(cartographic.longitude); // 经度
    pointInfo.latitude = Math.toDegrees(cartographic.latitude); // 纬度
    pointInfo.height = cartographic.height; // 高度
    return pointInfo
  }

  // 初始化事件监听
  _initEventListeners() {
    if (!this.viewer) return

    // 屏幕空间点击事件
    this.viewer.screenSpaceEventHandler.setInputAction((movement) => {

      const pickedObject = this.viewer.scene.pick(movement.position)

      // 点击时获取经纬度
      let ray = this.viewer.camera.getPickRay(movement.position);
      let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);

      this._pickedObject = pickedObject
      // 
      this._clickPosition = this.conversion(cartesian)

      console.log('点击', movement)

      // if (defined(pickedObject)) {
      // 触发所有点击回调
      this._eventHandlers.click.forEach(handler => {
        handler(this._clickPosition, pickedObject)
      })
      // }
    }, ScreenSpaceEventType.LEFT_CLICK)
  }

  // 添加事件监听器
  on(eventType, callback) {
    if (!this._eventHandlers[eventType]) {
      this._eventHandlers[eventType] = []
    }
    this._eventHandlers[eventType].push(callback)

    // 返回取消监听函数
    return () => {
      this.off(eventType, callback)
    }
  }

  // 移除事件监听器
  off(eventType, callback) {
    if (this._eventHandlers[eventType]) {
      const index = this._eventHandlers[eventType].indexOf(callback)
      if (index !== -1) {
        this._eventHandlers[eventType].splice(index, 1)
      }
    }
  }

  // 获取当前选中的对象
  getPickedObject() {
    return this._pickedObject
  }

  // 添加实体
  addEntity(options, type) {
    if (!this.viewer) {
      console.log('Cesium viewer 未初始化')
      return null
    }
    const entity = this.viewer.entities.add(options)
    this.entities.push(entity)
    if (type === 'point') {
      // 存一份真实点位经纬度高度信息
      const pointInfo = this.conversion(options.position)
      pointInfo.id = this.entitiesPointOptions.length + 1
      options.pointInfo = pointInfo;
      this.entitiesPointOptions.push(options)
    }
    return entity
  }
  // 新增视锥体
  addFrustum(position, parmas = { heading: BASE_HEADING, pitch: BASE_PITCH, fov: BASE_FOV }) {
    const options = JSON.parse(JSON.stringify(parmas));
    const { height, longitude, latitude } = position;

    options.fov = calculateFov(options.fov);
    // 远截面的距离  视野终点
    let far = height * 1.5 || BASE_FAR;
    if (height) {
      if (height > BASE_NEAR) {
        far = (height * 1.5 || BASE_FAR) - BASE_NEAR;
      } else {
        far = height * 1.5 || BASE_FAR;
      }
    }

    // 平面的宽高比  截面的宽高比
    const aspectRatio = 1.5;
    let frustum = new PerspectiveFrustum({
      // 查看的视场角，绕Z轴旋转，以弧度方式输入
      fov: Math.toRadians(options.fov),
      // 视锥体的宽度/高度
      aspectRatio: aspectRatio,
      // 近面距视点的距离
      near: BASE_NEAR,
      // 远面距视点的距离
      far: far,
    });

    let scene = this.viewer.scene;

    this.currentPrimitivesCamera = new Camera(scene);

    this.currentPrimitivesCamera.frustum = frustum;
    console.log(options, position, '更新视锥体-------options')

    this.currentPrimitivesCamera.setView({
      destination: Cartesian3.fromDegrees(longitude, latitude, height),
      orientation: {
        heading: Math.toRadians(options.heading),
        pitch: Math.toRadians(options.pitch),
        roll: BASE_ROLL,
      },
      up: Cartesian3.UNIT_Z,
    });
    this.updateFrustum();
  }

  //更新视锥体.
  updateFrustum() {
    const scene = this.viewer.scene;
    this.removeFrustum()
    this.currentPrimitive = new DebugCameraPrimitive({
      camera: this.currentPrimitivesCamera,
      color: Color.YELLOW,
      updateOnChange: false,
    });
    console.log('更新视锥体-------')
    scene.primitives.add(this.currentPrimitive);
  }

  // 移除视锥体
  removeFrustum() {
    const scene = this.viewer.scene;
    if (this.currentPrimitive) {
      scene.primitives.remove(this.currentPrimitive);
    }
  }
  // 移除实体
  removeEntity(entity) {
    if (!this.viewer) return false

    const index = this.entities.indexOf(entity)
    if (index !== -1) {
      this.viewer.entities.remove(entity)
      this.entities.splice(index, 1)
      return true
    }
    return false
  }

  // 清除所有实体
  clearEntities() {
    if (!this.viewer) return

    this.viewer.entities.removeAll()
    this.entities = []
  }

  // 设置相机位置
  flyTo(position, orientation, options = {}) {
    if (!this.viewer) return
    const defaultOptions = {
      destination: Cartesian3.fromDegrees(
        position.longitude,
        position.latitude,
        position.height || 1000
      ),
      orientation: {
        heading: (orientation && orientation.heading) ? Math.toRadians(orientation.heading) : Math.toRadians(0),
        pitch: (orientation && orientation.pitch) ? Math.toRadians(orientation.pitch) : Math.toRadians(IDEAL_BASE_PITCH),
        roll: 0
      },
      duration: 1,
      ...options
    }

    this.viewer.camera.flyTo(defaultOptions)
  }

  // 销毁实例
  destroy() {
    if (this.viewer && !this.viewer.isDestroyed()) {
      this.clearEntities()
      this.viewer.destroy()
      this.viewer = null
      this._initPromise = null
    }
  }
}

// 创建单例
const cesiumManager = new CesiumManager()

export default cesiumManager