import reducer from './reducer'

// 如通过 index 导出，由于 reducer 依赖 WeNavigator 依赖 modules下的Scene 依赖 navigation 模块，造成循环依赖
// 所以这里单独通过一个文件导出
export default {
  reducer,
  toString: () => 'navigation'
}
