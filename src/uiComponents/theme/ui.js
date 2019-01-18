/*
 * UI规范与建议值
*/

import {PixelRatio} from 'react-native'

// 色值。按通用场景划分，特殊颜色单独定义，无需列为全局变量。
const Color = {
  // 默认颜色
  normal: '#171a23',
  // 主色调
  primary: '#dcb35f',
  // 次要色调
  info: '#979797',
  // 链接
  link: '#4990e2',
  // 错误 & 警告
  error: '#e25d59',
  // 边框色
  border: '#efefef',
  // 一般元素背景色
  background: '#fff',
  // 页面背景色
  page: '#efefef',
  // placeholder
  placeholder: '#cdcdcd',
  // 行情上涨
  up: '#e25d59',
  // 行情下跌
  down: '#72c459',
  // 预留关键词
  warning: '',
  highlight: '',
  disabled: ''
}

// 字号。场景供参考，建议以组件的形式定义。
const FontSize = {
  // 提示文字
  small: 12,
  // 表单文字、正文文字等
  medium: 14,
  // 表单标题
  large: 15,
  // 标题栏标题、按钮文字
  xlarge: 17,
  // 资产数字
  xxlarge: 30
}

const FontFamaliy = {
  // 方正静蕾体 裁剪版
  // 用于生日闪屏等
  fzjl: 'FZJingLeiS-R-GB',
  // 金融数字字体
  avenir: 'Avenir Next LT Pro'
}

// 间距。这里不特意区分margin和padding；但是区分了X轴和Y轴。
const SpaceX = {
  small: 5,
  medium: 10,
  large: 15,
  xlarge: 25
}

const SpaceY = {
  small: 5,
  medium: 10,
  large: 15,
  xlarge: 25
}

// === 其它常量 ===

// 行高目前只有一个固定比例
const LineHeight = 1.5
// 圆角固定是5px
const BorderRadius = 5
// 边框一般是物理1px
const BorderWidth = 1 / PixelRatio.get()
// 列表项一般是44px
const ItemHeight = 44

// === 以下是建议值，供参考，一般建议在组件内使用 ===

// 布局
const Layout = {
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
    backgroundColor: Color.page
  },
  // 白色背景
  normalPage: {
    flex: 1,
    backgroundColor: Color.background
  },
  // 全屏（相对父元素）
  full: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  // 不可见（且不占据空间）
  hidden: {
    position: 'absolute',
    left: 0,
    top: -100,
    width: 0,
    height: 0
  }
}

// 文本（基于主要字号的组合）
const COMMON_FONT = {
  fontSize: FontSize.medium,
  lineHeight: Math.round(FontSize.medium * LineHeight)
}

const Text = {
  primary: {
    ...COMMON_FONT,
    color: Color.primary
  },
  normal: {
    ...COMMON_FONT,
    color: Color.normal
  },
  info: {
    ...COMMON_FONT,
    color: Color.info
  },
  muted: {
    ...COMMON_FONT,
    color: Color.placeholder
  }
}

// 边框
const Border = {
  top: {
    borderColor: Color.border,
    borderTopWidth: BorderWidth
  },
  bottom: {
    borderColor: Color.border,
    borderBottomWidth: BorderWidth
  },
  vertical: {
    borderColor: Color.border,
    borderBottomWidth: BorderWidth,
    borderTopWidth: BorderWidth
  }
}

// 封装为UI类，供全局统一调用。

const WeUI = {
  // 属性值列表
  border: Border,
  color: Color,
  fontFamaliy: FontFamaliy,
  fontSize: FontSize,
  layout: Layout,
  spaceX: SpaceX,
  spaceY: SpaceY,
  text: Text,
  // 常量部分
  lineHeight: LineHeight,
  itemHeight: ItemHeight,
  borderRadius: BorderRadius,
  borderWidth: BorderWidth
}

export default WeUI
