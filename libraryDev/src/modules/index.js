export default [require('./example').default]

const dyModules = {
  ui: () => require('./ui').default('ui')
}

export { dyModules }
