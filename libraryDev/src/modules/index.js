export default [
  require("./example").default,
  require("./tabExample").default,
  require("./tridentPluginWebView").default
]

const dyModules = {
  ui: () => require("./ui").default("ui"),
  // tabExample: () => require("./tabExample").default
}

export { dyModules }
