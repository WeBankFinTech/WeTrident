var compare = require('node-version-compare')

/**
 *
 * @param cmd cmd name
 * @param versionCmd cmd line to echo version
 * @param min
 * @param max
 * @param installGuide
 * @param installCmd
 */
function checkCmdAndVersion ({cmd, versionCmd, min, max, installGuide, installCmd}) {
  var execSync = require('child_process').execSync
  const checkCmdExisted = execSync(`if ! type ${cmd} > /dev/null; then echo "0"; else echo "-1"; fi`)
  if (checkCmdExisted.toString().trim() !== '-1') {
    return {
      cmd,
      msg: `${cmd} 未安装`,
      installGuide,
      installCmd
    }
  }

  if ((!min && !max) || !versionCmd) {
    return null
  }
  let version
  try {
    version = execSync(versionCmd)
  } catch (e) {
    return {
      cmd,
      msg: `${cmd} 版本检查出错建议重新安装`,
      installGuide,
      installCmd
    }
  }

  const versionStr = version.toString().trim()
  if (min && versionStr && compare(versionStr, min) < 0) {
    return {
      cmd,
      msg: `${cmd} 版本不能低于 ` + min + ', current ' + versionStr,
      installGuide,
      installCmd
    }
  }

  if (max && versionStr && compare(versionStr, max) > 0) {
    return {
      cmd,
      msg: `${cmd} 版本不能高于 ` + max + ', current ' + versionStr,
      installGuide,
      installCmd
    }
  }
  return null
}

function checkEnvVar({varName, installGuide}) {
  if (!varName) {
    return null
  }
  if (process.env[varName]) {
    return null
  } else {
    return {
      msg: `${varName} 必须设置到环境变量中`,
      installGuide
    }
  }
}

module.exports = {
  // 检查命令和命令版本
  checkCmdAndVersion,
  // 检查环境变量
  checkEnvVar
}
