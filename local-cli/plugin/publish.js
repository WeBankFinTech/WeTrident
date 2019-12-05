// var commonArgsDesc = require('./config/commonArgsDesc')
var execSync = (cmd) => {
  require('child_process').execSync(cmd, {stdio: [0, 1, 2]})
}
const path = require('path')
const dp = require('../utils/dependparser')
const pathConfig = require('../config/pathConfig')
const fs = require('fs')
const chalk = require('chalk')
const inquirer = require('inquirer')
const semver = require('semver')

function run (root, name) {
  if (!fs.existsSync(path.join(root, pathConfig.modulesPath + name))) {
    console.log(chalk.red(`Plugin(module) ${name} not found  ❌ , please check!`))
    process.exit()
  }

  dp.process(path.join(root, pathConfig.modulesPath + name), {
    blackList: [
      // "*demo.js"
    ]
  }, function (error, rawDependencies) {
    if (error) {
      console.log(error.code, error.message)
    } else {
      let pubDependencies = getPublishDependencies(root, rawDependencies)
      console.log('new dependencies for plugin [%s]: %o', name, pubDependencies)

      const pluginJsonPath = path.join(root, `${pathConfig.modulesPath + name}/package.json`)
      let packageJson = require(pluginJsonPath)
      // 替换依赖
      packageJson.dependencies = pubDependencies

      inquirer.prompt([{
        type: 'input',
        message: chalk.green(`\nPlease input new version ! 💡 Current version ${packageJson.version}\n`),
        name: 'ver'
      }]).then(answers => {
        let {ver} = answers
        packageJson.version = semver.valid(ver) && semver.gt(ver, packageJson.version) ? ver : semver.inc(packageJson.version, 'patch')
        fs.writeFileSync(pluginJsonPath, JSON.stringify(packageJson, null, 2))

        // 完成json的操作，执行发布
        publish(root, name)
      }, () => {
        console.log('Input error!!')
      })
    }
  })
}

function getPublishDependencies (root, rawDependencies) {
  const projDependencies = require(path.join(root, 'package.json')).dependencies
  const projDependList = Object.keys(projDependencies)
  let pubDependencies = {}
  rawDependencies.forEach(dep => {
    if (projDependList.indexOf(dep) !== -1) {
      pubDependencies[dep] = projDependencies[dep]
    } else { // 特例 @webank/trident
      for (let i in projDependList) {
        if (dep.startsWith(projDependList[i])) {
          pubDependencies[projDependList[i]] = projDependencies[projDependList[i]]
        }
      }
    }
  })
  return pubDependencies
}

function publish (root, name) {
  // TODO 这里应该还要支持添加额外的参数，例如发布到组下面需要添加 `--access publish`
  let publishCommand = `npm publish --verbose`

  try {
    process.chdir(path.join(root, pathConfig.modulesPath + name))
    execSync(publishCommand, {stdio: 'inherit'})
    console.log('Plugin publish done! 👏')
    process.chdir(root)
  } catch (e) {
    console.log(e)
    process.chdir(root)
  }
}

module.exports = {
  run
}
