/*
 * UI规范与建议值
*/

import {PixelRatio} from 'react-native'

// 色值。按通用场景划分，特殊颜色单独定义，无需列为全局变量。
const color = {
  // 主要文字信息
  primary: '#445C95',
  // 次要文字
  sub: '#888F9B',
  // 辅助文字
  third: '#acb2c1',
  // 提示文字
  info: '#D4DAE6',
  // 深色背景下主要文字信息
  lightPrimary: '#fff',
  // 深色背景下辅助文字
  lightSub: 'rgba(255, 255, 255, 0.5)',
  // 深色背景下提示文字
  lightInfo: 'rgba(255, 255, 255, 0.2)',
  // 链接
  link: '#3399eb',
  // 强调色
  important: '#F29360',
  // 分割线、边线
  border: '#E5E5E5',
  // 组件填充色
  filling: '#F29360',
  // 按压态组件填充色
  activeFilling: '#D98456',
  // 不可操作填充色
  disable: '#c0c0c0',
  // 页面背景色
  pageBackground: '#f7f7f7',
  // 深一点的背景验证
  deepBackground: '#f2f2f2',
  // 模块背景色
  moduleBackground: '#fff',
  // 行情上涨 & 警告色
  red: '#E26B53',
  // 行情下跌
  green: '#5DD1A5',
  // 成本均价
  yellow: '#eee90f'
}

// 字号。场景供参考，建议以组件的形式定义。
const fontSize = {
  // 提示文字
  small: 12,
  // 表单文字、正文文字等
  medium: 14,
  // 模块标题
  large: 16,
  // 导航栏标题、按钮文字
  xlarge: 18,
  // 资产数字
  xxlarge: 30
}

// 不同字号对应的行高
const lineHeight = {
  // 提示文字行高
  small: 18,
  // 表单文字、正文文字等行高
  medium: 21,
  // 模块标题行高
  large: 24,
  // 标题栏标题、按钮文字行高
  xlarge: 27,
  // 资产数字
  xxlarge: 45
}

const fontFamily = {
  // 方正静蕾体 裁剪版
  // 用于生日闪屏等
  fzjl: 'FZJingLeiS-R-GB',
  // 金融数字字体
  avenir: 'Avenir Next LT Pro'
}

// 间距。这里不特意区分margin和padding；但是区分了X轴和Y轴。
const spaceX = {
  // 用于行内元素，如一行文字中的活期+图标外边距
  small: 5,
  medium: 10,
  large: 15
}

const spaceY = {
  small: 5,
  medium: 10,
  large: 15,
  // 垂直方向多一个这个用于表示各个模块间的上下间距，这里有可能单独调整
  module: 10
}

// 圆角固定是5px
const borderRadius = 5
// label等比较小的元素圆角大小
const smallBorderRadius = 3
// 边框一般是物理1px
const realOnePixel = 1 / PixelRatio.get()
// 列表项一般是44px
const fixedRowHeight = 44

// 边框
const border = {
  top: {
    borderColor: color.border,
    borderTopWidth: realOnePixel
  },
  bottom: {
    borderColor: color.border,
    borderBottomWidth: realOnePixel
  },
  vertical: {
    borderColor: color.border,
    borderBottomWidth: realOnePixel,
    borderTopWidth: realOnePixel
  }
}

// 布局
const layout = {
  // 水平方向左对齐
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  // 水平方向居中对齐
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // 水平方向两端对齐
  rowJustify: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  // 垂直方向居中对齐
  colCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // 垂直方向两端对齐
  colJustify: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  // 大部分普通页面是浅灰色背景
  commonPage: {
    flex: 1,
    backgroundColor: color.pageBackground
  },
  // 白色背景
  normalPage: {
    flex: 1,
    backgroundColor: color.moduleBackground
  },
  // 全屏（相对父元素）
  full: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
}

const radius = {
  top: {
    borderTopLeft: borderRadius,
    borderTopRightRadius: borderRadius
  },
  bottom: {
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius
  }
}

// 封装为UI类，供全局统一调用。

const ProUI = {
  // 属性值列表
  color,
  fontSize,
  spaceX,
  spaceY,
  // 常量部分
  lineHeight,
  fixedRowHeight,
  borderRadius,
  smallBorderRadius,
  realOnePixel,
  layout,
  border,
  fontFamily,
  radius
}

export default ProUI
