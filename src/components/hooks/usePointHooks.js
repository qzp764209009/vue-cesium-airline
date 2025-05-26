import {
  Color,
  VerticalOrigin,
  StripeOrientation,

} from 'cesium'
export function usePointHooks() {
  // 点位渲染
  const pointOption = (index) => {
    return {
      billboard: {
        image:
          'data:image/svg+xml;base64,' +
          btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
    
                    <path d="M0 0 L50 0 L25 50 Z" fill="#1E90FF" stroke="#00008B" stroke-width="1"/>
                    <text x="25" y="25" font-size="16" text-anchor="middle" fill="white">${index}</text>
                </svg>
            `),
        width: 36,
        height: 36,
        verticalOrigin: VerticalOrigin.CENTER,
      }
    }
  }
  // 点位高度线渲染
  const stripeMaterialPropertyOption = {
    evenColor: Color.YELLOW.withAlpha(0.5), // 实线部分颜色
    oddColor: Color.TRANSPARENT, // 空白部分颜色
    repeat: 15, // 每单位长度重复次数
    orientation: StripeOrientation.VERTICAL,
  }
  // 多点位连线渲染
  const polylineOption = {
    width: 3,
    material: Color.fromCssColorString('rgb(29, 168, 203)'),
  }
  return { pointOption, stripeMaterialPropertyOption, polylineOption }
}