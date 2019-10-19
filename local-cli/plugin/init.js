const execSync = (cmd) => {
  require('child_process').execSync(cmd, { stdio: [0, 1, 2] })
}
const path = require('path')
const pathConfig = require('../config/pathConfig')
const fs = require('fs')
const chalk = require('chalk')

function run (root, name) {
  if (!fs.existsSync(path.join(root, pathConfig.modulesPath + name))) {
    console.log(chalk.red(`Plugin(module) ${name} not found❌ , please check!`))
    process.exit()
  }

  const readmePath = path.join(root, `${pathConfig.modulesPath + name}/README.md`)
  if (!fs.existsSync(readmePath)) {
    fs.writeFile(readmePath, `Hello ${name}`, 'utf8', () => {})
  }

  let initCommand = `npm init`
  try {
    process.chdir(path.join(root, pathConfig.modulesPath + name))
    execSync(initCommand, {stdio: 'inherit'})
    process.chdir(root)
  } catch (e) {
    console.log(e)
    process.chdir(root)
  }
}

module.exports = {
  run
}
