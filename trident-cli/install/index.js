const execSync = require('../utils/execSync')
const npmConfig = require('../npmConfig')
const installAll = () => {
  execSync(npmConfig.npm_install_all + ' --verbose')
  process.chdir('ios')
  execSync('pod install')
  process.chdir('..')

}

module.exports = {
  installAll
}
