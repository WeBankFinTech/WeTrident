import wrapModules from 'library/wrapModules'

const moduleList = [
  require('./example').default,
  // 这里添加模块
]

export default wrapModules(moduleList)
