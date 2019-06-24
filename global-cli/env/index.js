const { checkCmdAndVersion, checkEnvVar } = require('./_checkEnv')
const chalk = require('chalk')

function checkAllVersion () {
  return [
    checkCmdAndVersion(
      'node',
      'node --version | cut -d " " -f 3 | sed -e "s/[ |v]//g"',
      '8.3.0',
      null,
      '请到 https://nodejs.org/en/ 下载安装正确的版本'
    ),
    checkCmdAndVersion(
      'git',
      'git --version | cut -d " " -f 3 | sed -e "s/ //g"',
      '2.9.0',
      null,
      '请到 https://git-scm.com 下载安装正确的版本'
    ),
    checkCmdAndVersion(
      'pod',
      'pod --version',
      '1.2.0',
      null,
      '请到 https://cocoapods.org/ 下载安装正确的版本'
    ),
    checkCmdAndVersion(
      'npm',
      'npm --version',
      '5.8.0',
      null,
      '请使用 npm install -g npm@5.8.0 安装'
    ),
    checkCmdAndVersion(
      'fastlane',
      undefined,
      undefined,
      undefined,
      '请到 https://docs.fastlane.tools/getting-started/ios/setup/ 下载安装正确的版本, 行内需要切换到Staff-WiFi'
    ),
    // TODO Android环境可能会有不同的shell的问题
    // checkEnvVar('ANDROID_HOME')
  ].filter(item => !!item)
}

function logError (checkResult) {
  checkResult.filter(item => !!item.msg).forEach(item => {
    console.log(chalk.red(item.msg + '，' + item.installGuide))
  })
}

module.exports = {
  check: checkAllVersion,
  logError
}

