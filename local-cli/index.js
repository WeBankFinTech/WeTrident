#!/usr/bin/env node
const options = require('minimist')(process.argv.slice(2))

function run (root) {
  const cmd = options._[0]
  const subCmd = options._[1]
  console.log('root: ' + root)

  switch (cmd) {
    case 'init': {
      const init = require('./init').init
      const projectName = options.name
      const bundleId = options.bundleId
      init(root, projectName, bundleId)
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
    case 'env': {
      // TODO 每条命令添加参数检查
      switch (subCmd) {
        case 'check': {
          const checkResult = require('./env').check()
          checkResult.forEach(item => {
            console.log(item)
          })
          if (checkResult) {
            console.log('Everything is OK!')
          }
          break
        }
        case 'setup': {
          const checkResult = require('./env').check()
          require('./env').setup(checkResult)
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

function checkEnv () {
  const errorList = []
  // Android env
  if (!process.env.ANDROID_HOME) {
    errorList.push({
      id: 'android',
      desc: 'Android environment not ready!',
      installCmd: undefined,
      installGuide: 'Follow the docs https://developer.android.com/studio/install to setup android environment'
    })
  }

  // TODO iOS env xcodebuild
  // TODO pod exist and version check
  if (false ) {
    errorList.push({
      id: 'android',
      desc: 'Android environment not ready!',
      installCmd: 'sudo gem install cocoapods',
      installGuide: 'Follow the docs https://cocoapods.org/ to setup cocoapods environment'
    })
  }

  // TODO npm version
  // TODO fastlane env

  return errorList
}

function printDoctorReport (errorList) {
  if (errorList.length === 0) {
    console.log('Everything is OK!')
  } else {
    errorList.forEach(item => console.log(item.desc))
  }
}


module.exports = {
  init: require('./init').init,
  run
}

