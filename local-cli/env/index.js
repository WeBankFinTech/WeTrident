const checkCmdAndVersion = require('./_checkEnv')

function checkAllVersion () {
  return [
    checkCmdAndVersion(
      'node',
      'node --version | cut -d " " -f 3 | sed -e "s/[ |v]//g"',
      '8.0.0',
      '3.9.0',
      ''
    ),
    checkCmdAndVersion(
      'git',
      'git --version | cut -d " " -f 3 | sed -e "s/ //g"',
      '3.9.0',
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
    )
  ].filter(item => !!item)
}

function installAllDeps () {

}
module.exports = {
  check: checkAllVersion,
  setup: installAllDeps
}

