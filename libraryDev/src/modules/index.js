export default [
  require('./example').default('example'),
  require('./tridentPluginWebView').default('tridentPluginWebView')
]

const dyModules = {
  ui: () => require('./ui').default('ui'),
  tridentPluginFeedback: () =>
    require('./tridentPluginFeedback').default('tridentPluginFeedback')
}

export { dyModules }
