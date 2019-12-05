export default [require('./example').default('example')]

const dyModules = {
  ui: () => require('./ui').default('ui')
}

export { dyModules }
