const fs = require('fs')
const path = require('path')

function generatorDTS () {
  let code = ''
  let pathConfig = require('../config/pathConfig')
  if (process.env.useLocal === 'true') {
    pathConfig = require('../config/pathConfig-local')
  }
  let modules = {}

  fs.readdirSync(pathConfig.modulesPath).sort().forEach(moduleName => {
    if (fs.statSync(path.join(pathConfig.modulesPath, moduleName)).isDirectory()) {
      if (!modules[moduleName]) {
        modules[moduleName] = []

        fs.readdirSync(path.join(pathConfig.modulesPath, moduleName)).sort().forEach(scene => {
          if (fs.statSync(path.join(pathConfig.modulesPath, moduleName)).isDirectory()) {
            if (scene && scene.endsWith('Scene')) {
              modules[moduleName].push(scene)
            }
          }
        })
      }
    }
  })

  Object.keys(modules).forEach((key) => {
    if (modules[key]) {
      code += `    ${key}: {\n`
      modules[key].forEach(value => {
        code += `      ${value}(): void\n`
      })
      code += '    },\n'
    }
  })

  console.log(pathConfig.appNavigatorTplPath)
  let tpl = fs.readFileSync(pathConfig.appNavigatorTplPath, 'utf8')
  tpl = tpl.replace('//ADD_CODE', code)
  fs.writeFileSync(
    path.join('dts', 'AppNavigator.d.ts'),
    tpl,
    'utf8'
  )

  console.log('AppNavigator.d.ts updated!')
}

module.exports = { generatorDTS }
