const execSync = (cmd) => require('child_process').execSync(cmd, { stdio: 'inherit' })
const releaseAndroid = () => {
  // execSync('node ./node_modules/react-native/local-cli/cli.js bundle --platform android --entry-file index.js --bundle-output android/app/main/assets/main.jsbundle --assets-dest android/res/ --dev false')
  execSync('bundle exec fastlane android release --verbose')
}

const releaseIOS = () => {
  execSync('node ./node_modules/react-native/local-cli/cli.js bundle --entry-file index.js --platform ios --dev false --reset-cache --bundle-output ./ios/main.jsbundle --assets-dest "./ios"')
  execSync('bundle exec fastlane ios release --verbose')

}

module.exports = {
  releaseAndroid,
  releaseIOS
}
