const path = require('path')
const tridentCoreDevModulesPath = path.resolve(__dirname, '../trident-core')

module.exports = {
  /**
   * Add "global" dependencies for our RN project here so that our local components can resolve their
   * dependencies correctly
   */
  resolver: {
    extraNodeModules: {
      // '@unpourtous/trident-core': path.resolve(__dirname, '../trident-core/index.js'),
    },
  },
  // watchFolders: [tridentCoreDevModulesPath]
}
