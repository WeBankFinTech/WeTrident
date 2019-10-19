export default [require('./example').default, require('./tridentPluginWebView').default]

const dyModules = {
  ui: () => require('./ui').default('ui')
}

export { dyModules }
