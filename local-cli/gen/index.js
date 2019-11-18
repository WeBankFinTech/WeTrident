// var commonArgsDesc = require('./config/commonArgsDesc')
const execSync = (cmd) => {
  require('child_process').execSync(cmd, { stdio: [0, 1, 2] })
}
const chalk = require('chalk')
const inquirer = require('inquirer')
const _ = require('lodash')
// var dyRouter = require('../dyLoad/astTransformRouter.1')

const fs = require('fs')
const path = require('path')

const t = require('@babel/types')
const { insertElementInList, addElementInObject } = require('../utils/codeEdit')

const replaceInFile = require('replace-in-file')

let pathConfig = require('../config/pathConfig')
if (process.env.useLocal === 'true') {
  pathConfig = require('../config/pathConfig-local')
}

const author = require('child_process').execSync('whoami').toString().trim()
const existedModuleList = []
fs.readdirSync(pathConfig.modulesPath).forEach(file => {
  var filePath = path.join(pathConfig.modulesPath, file)
  var stat = fs.statSync(filePath)
  if (stat.isDirectory(filePath)) {
    existedModuleList.push(file)
  }
})

function checkNameValid (moduleName) {
  moduleName = _.camelCase(moduleName)
  if (existedModuleList.indexOf(moduleName) !== -1) {
    console.log(chalk.red(`Module called '${moduleName}' has existed, please change a name or delete the existed one`))
    return false
  }

  if (!moduleName) {
    console.log(chalk.red(`Empty module name`))
    return false
  }
  return true
}

function getSceneListUnderModulePath (modulesPath) {
  const sceneList = []
  fs.readdirSync(modulesPath).forEach(file => {
    var filePath = path.join(modulesPath, file)
    var stat = fs.statSync(filePath)
    if (stat.isDirectory(filePath) && file.endsWith('Scene')) {
      sceneList.push(file)
    }
  })
  return sceneList
}

/**
 * 填充sceneName
 * @param scenePath
 * @param servicePath
 * @param indexPath
 * @param sceneName
 * @param serviceName
 */
function fillSceneName (scenePath, servicePath, indexPath, sceneName, serviceName) {
  replaceInFile.sync({ files: scenePath, from: /TplScene/g, to: sceneName })
  replaceInFile.sync({ files: servicePath, from: /TplService/g, to: serviceName })
  replaceInFile.sync({ files: indexPath, from: /TplScene/g, to: sceneName })
  replaceAuthorAndCreateTime([scenePath, servicePath, indexPath, indexPath.replace('index', 'constants/ReportKeys')])
}

function replaceAuthorAndCreateTime (fileList) {
  replaceInFile.sync({ files: fileList, from: /{{author}}/g, to: author })
  replaceInFile.sync({ files: fileList, from: /{{createAt}}/g, to: new Date().toISOString() })
}

function _generatorScene (moduleName) {
  setTimeout(() => {
    if (!moduleName) {
      inquirer.prompt([{
        type: 'list',
        pageSize: 20,
        choices: existedModuleList,
        message: chalk.green('\nPlease select the which module to push Scene in !\n'),
        name: 'moduleName'
      }]).then(answers => {
        _generatorScene(answers.moduleName)
      })
    } else {
      inquirer.prompt([{
        type: 'input',
        message: chalk.green(`\nPlease input your Scene name(module: ${moduleName})!\n`),
        name: 'sceneName'
      }]).then(answers => {
        let { sceneName } = answers
        sceneName = _.upperFirst(sceneName)

        if (!sceneName) {
          console.log(chalk.red(`Empty scene name`))
          process.exit()
        }

        const modulePath = pathConfig.modulesPath + moduleName + '/'
        const existedSceneList = getSceneListUnderModulePath(modulePath)

        sceneName = sceneName.endsWith('Scene') ? sceneName : (sceneName + 'Scene')
        const serviceName = sceneName.replace('Scene', 'Service')
        if (existedSceneList.indexOf(sceneName) !== -1) {
          console.log(chalk.red(`Scene called '${sceneName}' has existed, please change a name or delete the existed one`))
          process.exit()
        }

        const sceneTplPath = pathConfig.sceneTplPath
        const sceneDir = pathConfig.modulesPath + moduleName + '/' + sceneName
        const scenePath = `${path.join(sceneDir, sceneName)}.js`
        const servicePath = `${path.join(sceneDir, serviceName)}.js`
        const indexPath = `${path.join(sceneDir, 'index.js')}`
        const manifestPath = `${path.join(modulePath, 'manifest.js')}`

        execSync(`cp -r ${sceneTplPath} ${sceneDir}`)
        execSync(`mv ${path.join(sceneDir, 'Scene')}.js ${scenePath}`)
        execSync(`mv ${path.join(sceneDir, 'Service')}.js ${servicePath}`)

        fillSceneName(scenePath, servicePath, indexPath, sceneName, serviceName)

        // 插入scene到配置到清单
        const requireCallExpression = t.callExpression(t.identifier('require'), [t.stringLiteral('./' + sceneName)])
        const newMember = t.memberExpression(requireCallExpression, t.identifier('default'))
        insertElementInList(manifestPath, newMember)

        // generator AppNavigator.d.ts
        require('./AppNavigatorDSTGenarator').generatorDTS()
        setTimeout(() => {
          _generatorScene(moduleName)
        }, 500)
      }, () => {
        console.log(chalk.red('Input Scene name error!'))
      })
    }
  }, 500)
}

function _generatorModule () {
  setTimeout(() => {
    inquirer.prompt([{
      type: 'input',
      message: chalk.green('\nPlease input your module name !\n'),
      name: 'moduleName'
    }]).then(answers => {
      let { moduleName } = answers

      if (!checkNameValid(moduleName)) {
        process.exit()
      }

      // TODO 输入检查
      const moduleTplPath = pathConfig.moduleTplPath
      const modulePath = pathConfig.modulesPath + moduleName
      const moduleIndexPath = pathConfig.modulesPath + 'index.js'

      execSync(`cp -r ${moduleTplPath} ${modulePath}`)

      fillModuleName(moduleName)

      // 插入模块到模块列表, 静态加载
      const requireCallExpression = t.callExpression(t.identifier('require'), [t.stringLiteral('./' + moduleName)])
      const newMember = t.memberExpression(requireCallExpression, t.identifier('default'))
      // 动态传入moduleName，即 require('./xx').default(moduleName)
      const newMemberCallExpression = t.callExpression(newMember, [t.stringLiteral(moduleName)])
      const moduleArrayFunction = t.arrowFunctionExpression([], newMemberCallExpression, false)

      const generate = require('babel-generator').default
      console.log(generate(t.objectProperty(t.identifier(moduleName), moduleArrayFunction), { retainLines: true }).code)
      addElementInObject(moduleIndexPath, t.objectProperty(t.identifier(moduleName), moduleArrayFunction))

      // 提示是否继续创建Scene
      setTimeout(() => {
        _generatorScene(moduleName)
      }, 300)
    }, () => {
      console.log('Input error!!')
    })
  }, 500)
}

/**
 * 填充moduleName
 * @param moduleName
 */
function fillModuleName (moduleName) {
  const moduleIndexPath = path.join(pathConfig.modulesPath, `${moduleName}/index.js`)
  // replaceInFile.sync({ files: moduleIndexPath, from: /TplModuleName/g, to: moduleName })

  replaceAuthorAndCreateTime([moduleIndexPath, moduleIndexPath.replace('index', 'manifest')])
}

// add gulp meta data
function generatorScene () {
  _generatorScene()
}

generatorScene.description = chalk.green('Create a Scene in a specified module from code template !')

function generatorModule () {
  _generatorModule()
}

generatorModule.description = chalk.green('Create a new module from code template !')

module.exports = {
  generatorModule,
  generatorScene
}
