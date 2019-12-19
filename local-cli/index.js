#!/usr/bin/env node
const options = require('minimist')(process.argv.slice(2))
const chalk = require('chalk')

function run (root) {
  const cmd = options._[0]
  const subCmd = options._[1]

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
          androidPackager(root)
          break
        }
      }
      break
    }
    case 'gen': {
      const gen = require('./gen')
      const projectName = subCmd
      if (projectName === 'module') {
        gen.generateModule(options)
      } else if (projectName === 'scene') {
        gen.generateScene(options)
      } else {
        console.log(chalk.yellow('Unknown type, use `gen module --name=` or `gen scene` '))
      }
      break
    }
    case 'packager': {
      if (subCmd === 'start') {
        const packager = require('./packager')
        packager.start(options)
        break
      }
      break
    }
    case 'release': {
      const release = require('./release')
      switch (subCmd) {
        case 'android': {
          release.releaseAndroid(options)
          break
        }
        case 'ios': {
          release.releaseIOS(options)
          break
        }
      }
      break
    }
    case 'run': {
      const run = require('./run')
      switch (subCmd) {
        case 'android': {
          run.runAndroid(options)
          break
        }
        case 'ios': {
          run.runIOS(options)
          break
        }
      }
      break
    }
    case 'traversal': {
      const traversal = require('./traversal')
      switch (subCmd) {
        case 'start': {
          traversal.start(root)
          break
        }
      }
      break
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
