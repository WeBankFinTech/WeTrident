var compare = require('node-version-compare')

/**
 *
 * @param cmd cmd name
 * @param versionCmd cmd line to echo version
 * @param min
 * @param max
 * @param installGuide
 */
function checkCmdAndVersion (cmd, versionCmd, min, max, installGuide) {
  var execSync = require('child_process').execSync
  const checkCmdExisted = execSync(`if ! type ${cmd} > /dev/null; then echo "0"; else echo "-1"; fi`)
  if (checkCmdExisted.toString().trim() !== '-1') {
    return {
      msg: `${cmd} not installed`,
      installGuide: installGuide
    }
  }

  if ((!min && !max) || !versionCmd) {
    return null
  }
  const version = execSync(versionCmd)
  const versionStr = version.toString()
  if (min && versionStr && compare(versionStr, min) < 0) {
    return {
      msg: `${cmd} vesion should be at least ` + min + ', current ' + versionStr,
      installGuide: installGuide
    }
  }

  if (max && versionStr && compare(versionStr, max) > 0) {
    return {
      msg: `${cmd} vesion should at most ` + max + ', current ' + versionStr,
      installGuide: installGuide
    }
  }
  return null
}

function checkEnvVar(varName) {
  if (!varName) {
    return null
  }
  if (process.env[varName]) {
    return null
  } else {
    return {
      msg: `${varName} must set in shell environment`,
      installGuide: 'Please install android development tools'
    }
  }
}

module.exports = {
  // 检查命令和命令版本
  checkCmdAndVersion,
  // 检查环境变量
  checkEnvVar
}
