const { checkCmdAndVersion, checkEnvVar } = require('./_checkEnv')
const chalk = require('chalk')
const inquirer = require('inquirer')
const execSync = (cmd) => require('child_process').execSync(cmd, {stdio: 'inherit'})

function checkAllVersion () {
  return [
    checkCmdAndVersion({
      cmd: 'node',
      versionCmd: 'node --version | cut -d " " -f 3 | sed -e "s/[ |v]//g"',
      min: '8.3.0',
      max: null,
      installGuide: '请到 https://nodejs.org/en/ 下载安装正确的版本'
    }),
    checkCmdAndVersion({
      cmd: 'npm',
      versionCmd: 'npm --version',
      min: '5.8.0',
      max: null,
      installCmd: 'npm install -g npm@5.8.0'
    }),
    checkCmdAndVersion({
      cmd: 'git',
      versionCmd: 'git --version | cut -d " " -f 3 | sed -e "s/ //g"',
      min: '2.9.0',
      max: null,
      installGuide: '请到 https://git-scm.com 下载安装正确的版本'
    }),
    checkCmdAndVersion({
      cmd: 'brew',
      versionCmd: undefined,
      min: undefined,
      max: undefined,
      installCmd: '/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)'
    }),

    checkCmdAndVersion({
      cmd: 'pod',
      versionCmd: 'pod --version',
      min: '1.4.0',
      max: null,
      installCmd: 'sudo gem install cocoapods -v 1.4.0'
    }),

    checkCmdAndVersion({
      cmd: 'xcodeproj',
      versionCmd: 'xcodeproj --version',
      min: '1.10.0',
      max: null,
      installCmd: 'sudo gem install xcodeproj -v 1.10.0'
    }),

    checkCmdAndVersion({
      cmd: 'fastlane',
      versionCmd: undefined,
      min: undefined,
      max: undefined,
      installCmd: 'sudo gem install fastlane -NV'
    }),
    checkEnvVar('ANDROID_HOME')
  ].filter(item => !!item)
}

function processCheckResult (checkResult) {
  return new Promise((resolve, reject) => {
    checkResult.filter(item => !!item.msg).forEach(item => {
      console.log(chalk.red(item.msg))
    })

    // 可以自动安装的内容
    const installCmdList = checkResult.filter(item => !!item.installCmd)

    // 只能通过安装指引指引安装的内容
    const installGuideList = checkResult.filter(item => !!item.installGuide)

    inquirer.prompt([{
      type: 'confirm',
      message: chalk.green(`\n自动安装即将运行如下命令: \n${installCmdList.map(item => item.installCmd).join('\n')}\n\n你需要自动安装${installCmdList.map(item => item.cmd).join(', ')}吗? \n`),
      name: 'chooseAutoInstall'
    }]).then(answers => {
      console.log(answers.chooseAutoInstall)
      if (answers.chooseAutoInstall) {
        autoInstallAndLogGuide(installCmdList, installGuideList)
        resolve()
      } else {
        logGuide(installCmdList, installGuideList)
        reject()
      }
    }, () => {
      logGuide(installCmdList, installGuideList)
      reject()
    })
  })
}

function autoInstallAndLogGuide (installCmdList, installGuideList) {
  installCmdList.forEach(item => {
    console.log(`开始自动安装${item.cmd}...`)
    execSync(item.installCmd)
    console.log('')
  })

  installGuideList.forEach(item => {
    console.log(chalk.red(item.installGuide))
  })
}

function logGuide(installCmdList, installGuideList) {
  installCmdList.forEach(item => {
    console.log(chalk.red(`请运行 ${item.installCmd} 安装${item.cmd}`))
  })

  installGuideList.forEach(item => {
    console.log(chalk.red(item.installGuide))
  })
}

module.exports = {
  check: checkAllVersion,
  processCheckResult
}

