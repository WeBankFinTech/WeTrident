#!/usr/bin/env node
const options = require('minimist')(process.argv.slice(2))

function run (root) {
  const cmd = options._[0]
  const subCmd = options._[1]
  // console.log('root: ' + root)

  switch (cmd) {
    case 'init': {
      const init = require('./init').init
      const projectName = options.name
      const bundleId = options.bundleId
      init(root, projectName, bundleId)
      break
    }
    case 'distribute': {
      switch (subCmd) {
        case 'androidPack': {
          const androidPackager = require('./distribute').androidPack
          androidPack(root)
          break
        }
      }
      break
    }
    case 'gen': {
      const gen = require('./gen')
      const projectName = subCmd
      if (projectName === 'module') {
        gen.generatorModule()
      } else if (projectName === 'scene') {
        gen.generatorScene()
      } else {
        console.warn('unknow type, use `gen module --name=` or `gen scene` ')
      }
      break
    }
    case 'packager': {
      switch (subCmd) {
        case 'start': {
          const packager = require('./packager')
          packager.start(options)
          break
        }
      }
    }
    case 'plugin': {
      // TODO 每条命令添加参数检查
      switch (subCmd) {
        case 'add': {
          const pluginName = options._[2]
          require('./plugin/add').run(root, pluginName)
          break
        }
        case 'publish': {
          const pluginName = options._[2]
          require('./plugin/publish').run(root, pluginName)
          break
        }
        case 'init': {
          const pluginName = options._[2]
          require('./plugin/init').run(root, pluginName)
          break
        }
      }
    }
  }
}
module.exports = {
  init: require('./init').init,
  run
}

