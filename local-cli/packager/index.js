const execRNCmd = require('../utils/execRNCmd')
function start (options) {
  const path = require('path')
  const fs = require('fs')

  // TODO 检查端口号范围
  // 从 trident-config.json 里面读取端口号
  let tridentConfig = {}
  if (fs.existsSync(path.resolve(process.cwd(), './trident-config.json'))) {
    tridentConfig = require(path.resolve(process.cwd(), './trident-config.json'))
  }
  options.port = options.port || tridentConfig.port || 8081 // react native's default value

  const passArgs = Object.keys(options).filter(key => key !== '_').map(key => {
    if (options[key] === true) {
      return `--${key}`
    }
    return `--${key}=${options[key]}`
  }).join(' ')

  execRNCmd(`scripts/packager.sh ${passArgs}`) && console.log('React Native packager is started...')
}

module.exports = {
  start
}
