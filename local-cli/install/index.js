const execSync = require('../utils/execSync')
const npmConfig = require('../config/npmConfig')
const installAll = () => {
  // execSync('node ./node_modules/react-native/local-cli/cli.js bundle --platform android --entry-file index.js --bundle-output android/app/main/assets/main.jsbundle --assets-dest android/res/ --dev false')
  execSync(npmConfig.npm_install_all)
  process.chdir('ios')
  execSync('pod install')
  process.chdir('..')

}

module.exports = {
  installAll
}
