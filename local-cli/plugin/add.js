// var commonArgsDesc = require('./config/commonArgsDesc')
var execSync = (cmd) => {
  require('child_process').execSync(cmd, { stdio: [0, 1, 2] })
}
var _ = require('lodash')
// var dyRouter = require('../dyLoad/astTransformRouter.1')
const t = require('@babel/types')
const { insertElementInList } = require('../utils/codeEdit')

var path = require('path')

function run (projectRoot, name) {
  // TODO 真正的安装之前需要检查一下是否已经安装过
  let installCommand = `yarn add ${name} --verbose`

  // TODO 自动添加 trident-plugin 前缀
  try {
    execSync(installCommand, { stdio: 'inherit' })

    const requireCallExpression = t.callExpression(t.identifier('require'), [t.stringLiteral(name)])
    const newMember = t.memberExpression(requireCallExpression, t.identifier('default'))

    const moduleIndexPath = path.join(projectRoot, 'src/core/modules/index.js')
    insertElementInList(moduleIndexPath, newMember)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  run
}
