#!/usr/bin/env node
const options = require('minimist')(process.argv.slice(2))


function run (root, options) {
  console.log(options)

  const cmd = options._[0]

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
      const projectName = options.name
      if (projectName === 'module') {
        gen.generatorModule()
      } else if (projectName === 'scene') {
        gen.generatorScene()
      } else {
        console.warn('know type, use `gen module` or `gen scene` ')
      }
      break
    }
    case 'doctor': {
      const errorList = []
      // Android env
      if (!process.env.ANDROID_HOME) {
        errorList.push('Android environment not ready!')
      }

      // TODO iOS env xcodebuild
      // TODO pod version
      // TODO npm version
      // TODO fastlane env

      printDoctorReport(errorList)
    }
    case 'setupEnv': {
      // 安装初始化环境
    }
  }
}

function printDoctorReport (errorList) {
  errorList.forEach(item => console.log(item))
}


module.exports = {
  init: require('./init').init,
  run
}

