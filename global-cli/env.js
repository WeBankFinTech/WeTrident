// 对外发布以前默认用wnpm
let npmClient = 'wnpm'
if (['npm', 'wnpm', 'yarn'].includes(process.env.npmClient)) {
  npmClient = process.env.npmClient
}

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
  },
}

module.exports = config[npmClient]
