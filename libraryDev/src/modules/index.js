export default [
  require("./ui").default("ui"),
  require("./example").default("example"),
  require("./tabExample").default("tabExample"),
  require("./tridentPluginWebView").default("tridentPluginWebView")
]

const dyModules = {
  ui: () => require("./ui").default("ui"),
}

export { dyModules }
