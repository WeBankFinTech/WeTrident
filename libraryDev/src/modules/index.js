export default [
  require('./example').default,
]

// TODO 这里还需要在创建的时候做区分, 或者默认加到动态列表
const dyModules = {
  ui: () => require('./ui').default('ui'),
  // example: () => require('./example').default,
}
export {
  dyModules
}
