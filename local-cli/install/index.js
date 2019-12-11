const execSync = require('../utils/execSync')
const npmConfig = require('../config/npmConfig')
const installAll = () => {
  execSync(npmConfig.npm_install_all)
  process.chdir('ios')
  execSync('pod install')
  process.chdir('..')

}

module.exports = {
  installAll
}
