class ServerEnv {
  static PREFIX = {}

  static envConfig = {
    mockio: {
      production: 'https://www.mocky.io/',
      preRelease: 'https://www.mocky.io/',
      test: 'https://www.mocky.io/'
    },
    testserver: {
      production: 'https://www.testserver.io/',
      preRelease: 'https://www.testserver.io/',
      test: 'https://www.testserver.io/'
    }
  }

  static setEnv (envKey) {
    ServerEnv.PREFIX = {}
    Object.keys(this.envConfig).forEach(cgiKey => {
      ServerEnv.PREFIX[cgiKey] = ServerEnv.envConfig[cgiKey][envKey]
    })
  }
}
ServerEnv.setEnv('production')
export default ServerEnv
