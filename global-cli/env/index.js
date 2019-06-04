const { checkCmdAndVersion, checkEnvVar } = require('./_checkEnv')
const chalk = require('chalk')

function checkAllVersion () {
  return [
    checkCmdAndVersion(
      'node',
      'node --version | cut -d " " -f 3 | sed -e "s/[ |v]//g"',
      '8.3.0',
      null,
      ''
    ),
    checkCmdAndVersion(
      'git',
      'git --version | cut -d " " -f 3 | sed -e "s/ //g"',
      '2.9.0',
      null,
      ''
    ),
    checkCmdAndVersion(
      'pod',
      'pod --version',
      '1.2.0',
      null,
      ''
    ),
    checkCmdAndVersion(
      'npm',
      'npm --version',
      '5.8.0',
      null,
      ''
    ),
    checkCmdAndVersion(
      'fastlane',
      undefined,
      undefined,
      undefined,
      ''
    ),
    checkEnvVar('ANDROID_HOME')
  ].filter(item => !!item)
}

function installAllDeps () {
}

function logError (checkResult) {
  checkResult.map(item => item.msg).filter(item => !!item).forEach(item => {
    console.log(chalk.red(item))
  })
}

module.exports = {
  check: checkAllVersion,
  setup: installAllDeps,
  logError
}

