// var commonArgsDesc = require('./config/commonArgsDesc')
var execSync = (cmd) => {
  require('child_process').execSync(cmd, { stdio: [0, 1, 2] })
}
var path = require('path')

function run (root, name) {
  // TODO 这里应该还要支持添加额外的参数，例如发布到组下面需要添加 `--access publish`
  let installCommand = `npm publish --verbose`

  try {
    process.chdir(path.join(root, 'src/core/modules/' + name))
    execSync(installCommand, { stdio: 'inherit' })
    process.chdir(root)
  } catch (e) {
    console.log(e)
    process.chdir(root)
  }
}

module.exports = {
  run
}
