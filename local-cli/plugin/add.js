// var commonArgsDesc = require('./config/commonArgsDesc')
var execSync = (cmd) => {
  require('child_process').execSync(cmd, { stdio: [0, 1, 2] })
}
const t = require('@babel/types')
const { addElementInObject } = require('../utils/codeEdit')
const env = require('../config/npmConfig')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const pathConfig = require(process.env.useLocal === 'true' ? '../config/pathConfig-local' : '../config/pathConfig')

// 先获取module目录，防止插件与本地目录发生冲突
const existedModuleList = []
fs.readdirSync(pathConfig.modulesPath).forEach(file => {
  var filePath = path.join(pathConfig.modulesPath, file)
  var stat = fs.statSync(filePath)
  if (stat.isDirectory(filePath)) {
    existedModuleList.push(file)
  }
})
let _reinstall = false
let _root

function run (root, name) {
  _root = root
  const projDependencies = require(path.join(root, 'package.json')).dependencies

  if (projDependencies[name]) {
    inquirer.prompt([{
      type: 'confirm',
      message: chalk.red(`\nPlugin [${name}] is already installed, update anyway?\n`),
      name: 'reinstall'
    }]).then(answers => {
      if (answers.reinstall === true) {
        _reinstall = true
        add(name)
      }
    })
  } else {
    add(name)
  }
}

function add (name) {
  const installCommand = !_reinstall ? `${env.npm_install_xxx} ${name} --verbose` : `${env.npm_install_xxx} ${name}@latest --verbose`

  try {
    execSync(installCommand, { stdio: 'inherit' })

    if (!_reinstall) {
      getModuleName(name)
    }
  } catch (e) {
    console.log(e)
  }
}

function getModuleName (npmPluginName) {
  let defaultName = npmPluginName
  try {
    // delete group & parse to camelCase: @webank/trident-plugin-a => tridentPluginA
    defaultName = _.camelCase(npmPluginName.replace(/^@.+\//, ''))
  } catch (e) {}
  inquirer.prompt([{
    type: 'input',
    message: chalk.green(`\nPlease input moduleName! 💡 Press [Enter] to use default name: ${defaultName}\n`),
    name: 'moduleName'
  }]).then(answers => {
    const { moduleName } = answers
    // TODO moduleName 统一检查，通 genModule
    const finalName = moduleName || defaultName

    // not in existed moduleList
    if (existedModuleList.indexOf(finalName) === -1) {
      addAsModule(finalName, npmPluginName)
    } else {
      console.log(chalk.red(`Module called '${finalName}' has existed, please change a name or delete the existed one`))
      setTimeout(() => getModuleName(npmPluginName), 1000)
    }
  }, () => {
    console.log('Input error!!')
  })
}

function addAsModule (moduleName, npmPluginName) {
  const requireCallExpression = t.callExpression(t.identifier('require'), [t.stringLiteral(npmPluginName)])
  const newMember = t.memberExpression(requireCallExpression, t.identifier('default'))
  const newMemberCallExpression = t.callExpression(newMember, [t.stringLiteral(moduleName)])
  const moduleArrayFunction = t.arrowFunctionExpression([], newMemberCallExpression, false)

  const moduleIndexPath = path.join(_root, 'src/modules/index.js')
  // insertElementInList(moduleIndexPath, newMember)
  addElementInObject(moduleIndexPath, t.objectProperty(t.identifier(moduleName), moduleArrayFunction))
}

module.exports = {
  run
}
