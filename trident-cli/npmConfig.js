const npmClient = process.env.npmClient || 'npm'

const config = {
  wnpm: {
    npm_install_xxx: 'wnpm install ',
    npm_install_all: 'wnpm install '
  },
  npm: {
    npm_install_xxx: 'npm install ',
    npm_install_all: 'npm install '
  },
  yarn: {
    npm_install_xxx: 'yarn add ',
    npm_install_all: 'yarn '
  }
}

module.exports = config[npmClient]
