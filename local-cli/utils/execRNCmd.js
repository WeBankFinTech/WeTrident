const execSync = require('./execSync')
const fs = require('fs')
const chalk = require('chalk')

module.exports = (relativeCmdPath) => {
  let rnPath = undefined
  if (fs.existsSync('node_modules/react-native/')) {
    rnPath = 'node_modules/react-native/'
  } else if (fs.existsSync('node_modules/@webank/trident/node_modules/react-native/')) {
    rnPath = 'node_modules/@webank/trident/node_modules/react-native/'
  }

  if (!rnPath) {
    console.log(chalk.yellow('Dependencies not installed, use "tdt install" to install all dependencies'))
    return false
  } else {
    execSync(rnPath + relativeCmdPath)
    return true
  }
}
