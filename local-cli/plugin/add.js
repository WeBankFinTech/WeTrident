// var commonArgsDesc = require('./config/commonArgsDesc')
var execSync = (cmd) => {
  require('child_process').execSync(cmd, { stdio: [0, 1, 2] })
}
const t = require('@babel/types')
const { insertElementInList } = require('../utils/codeEdit')
const env = require('../config/npmConfig')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')

function run (root, name) {
  const projDependencies = require(path.join(root, 'package.json')).dependencies

  if (projDependencies[name]) {
    inquirer.prompt([{
      type: 'confirm',
      message: chalk.red(`\nPlugin [${name}] is already installed, update anyway?\n`),
      name: 'reinstall'
    }]).then(answers => {
      if (answers.reinstall === true) {
        add(root, name, true)
      }
    })
  } else {
    add(root, name)
  }
}

function add (root, name, reinstall) {
  let installCommand = `${env.npm_install_xxx} ${name} --verbose`

  try {
    execSync(installCommand, { stdio: 'inherit' })

    if (!reinstall) {
      const requireCallExpression = t.callExpression(t.identifier('require'), [t.stringLiteral(name)])
      const newMember = t.memberExpression(requireCallExpression, t.identifier('default'))

      const moduleIndexPath = path.join(root, 'src/modules/index.js')
      insertElementInList(moduleIndexPath, newMember)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  run
}
