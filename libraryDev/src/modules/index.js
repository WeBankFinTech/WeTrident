export default [
  require("./example").default("example"),
  require("./tabExample").default("tabExample"),
  require("./tridentPluginWebView").default("tridentPluginWebView")
]

const dyModules = {
  ui: () => require("./ui").default("ui"),
  // tabExample: () => require("./tabExample").default
}

export { dyModules }
