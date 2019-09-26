// var commonArgsDesc = require('./config/commonArgsDesc')
var execSync = (cmd) => {
  require('child_process').execSync(cmd, { stdio: [0, 1, 2] })
}
var path = require('path')
const pathConfig = require('../utils/pathConfig')

function run (root, name) {
  // TODO 这里应该还要支持添加额外的参数，例如发布到组下面需要添加 `--access publish`
  let publishCommand = `npm publish --verbose`

  // TODO 发布前检查npm是否有这个包
  // TODO 发布前检查当前git都状态，提示是否增加版本号

  try {
    process.chdir(path.join(root, pathConfig.modulesPath + name))
    execSync(publishCommand, { stdio: 'inherit' })
    process.chdir(root)
  } catch (e) {
    console.log(e)
    process.chdir(root)
  }
}

module.exports = {
  run
}
