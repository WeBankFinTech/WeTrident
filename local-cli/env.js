let env = {}

if (process.env.internal === 'true') {
  env = {
    npm_install_xxx: 'wnpm install ',
    npm_install_all: 'wnpm install '
  }
} else {
  env = {
    npm_install_xxx: 'yarn add ',
    npm_install_all: 'yarn '
  }
}

module.exports = env