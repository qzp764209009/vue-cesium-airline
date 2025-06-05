import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export const initIcons = (app) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
