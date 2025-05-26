# vue-cesium-airline 🚀
  
**vue-cesium-airline** 是一个基于 [vue3+vite+cesium+天地图] 的 [应用]，用于 [无人机航点航线设计]。

## 主要功能 ✨
- 新增航点
- 新增视锥体
- 视锥体范围展示
- 偏航角控制
- 俯仰角控制
- 焦距控制

## 项目开始前检查 📋
运行该项目前，请确保已安装：
- [Node.js](https://nodejs.org/) (v20+)

## 关键修改说明：
1. .env 文件里面 VITE_CESIUM_TOKEN 是 Cesium Ion 令牌, 替换成自己申请的token。 可以去 [Cesium Ion 官网](https://cesium.com/platform/cesium-ion/) 获取
2. .env 文件里面 VITE_CESIUM_WEB_KEY 是 天地图密钥,替换成自己生成的密钥。 可以去 [天地图 官网](http://lbs.tianditu.gov.cn/) 获取

## 运行步骤 ⚙️
克隆仓库并安装依赖：
```bash
git clone https://github.com/qzp764209009/vue-cesium-airline.git
pnpm install 
pnpm run dev

