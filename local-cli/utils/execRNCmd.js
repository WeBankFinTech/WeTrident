module.exports = () => {
  let packagerSh = undefined
  if (fs.existsSync('node_modules/react-native/')) {
    packagerSh = 'node_modules/react-native/'
  } else if (fs.existsSync('node_modules/@webank/trident/node_modules/react-native/')) {
    packagerSh = 'node_modules/@webank/trident/node_modules/react-native/'
  }

  if (!packagerSh) {
    console.warn('Dependencies not installed, use "tdt install" to install all dependencies')
  }
  return packagerSh
}
