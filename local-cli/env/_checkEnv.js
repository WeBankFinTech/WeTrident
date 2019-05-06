var compare = require('node-version-compare')

/**
 *
 * @param cmd cmd name
 * @param versionCmd cmd line to echo version
 * @param min
 * @param max
 * @param installGuide
 */
module.exports = (cmd, versionCmd, min, max, installGuide) => {
  var execSync = require('child_process').execSync
  const checkCmdExisted = execSync(`if ! type ${cmd} > /dev/null; then echo "0"; else echo "-1"; fi`)
  if (checkCmdExisted.toString().trim() !== '-1') {
    return {
      msg: `${cmd} not installed`,
      installGuide: installGuide
    }
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
