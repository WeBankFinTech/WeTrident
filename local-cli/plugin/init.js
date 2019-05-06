// var commonArgsDesc = require('./config/commonArgsDesc')
var execSync = (cmd) => {
  require('child_process').execSync(cmd, { stdio: [0, 1, 2] })
}
var path = require('path')

function run (root, name) {
  // TODO 根据目录名字添加包名，检查npm是否已经有包等
}

module.exports = {
  run
}
