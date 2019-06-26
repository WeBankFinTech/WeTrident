function start (options) {
  const path = require('path')
  const fs = require('fs')
  const execSync = (cmd) => require('child_process').execSync(cmd, {stdio: 'inherit'})

  // TODO 检查端口号范围
  // 从 trident-config.json 里面读取端口号
  let tridentConfig = {}
  if (fs.existsSync(path.resolve(process.cwd(), './trident-config.json'))) {
    tridentConfig = require(path.resolve(process.cwd(), './trident-config.json'))
  }
  options.port = options.port || tridentConfig.port || 8081 // react native's default value

  // TODO 持续输入现在打不到控制台，这里需要调整一下
  console.log('React Native packager is started...')

  const passArgs = Object.keys(options).filter(key => key !== '_').map(key => {
    if (options[key] === true) {
      return `--${key}`
    }
    return `--${key}=${options[key]}`
  }).join(' ')
  console.log('node_modules/react-native/scripts/packager.sh ' + passArgs)
  execSync('node_modules/react-native/scripts/packager.sh ' + passArgs)
}

module.exports = {
  start
}