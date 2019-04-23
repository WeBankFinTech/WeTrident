// var commonArgsDesc = require('./config/commonArgsDesc')
var execSync = (cmd) => {
  require('child_process').execSync(cmd, { stdio: [0, 1, 2] })
}
var chalk = require('chalk')
var inquirer = require('inquirer')
var _ = require('lodash')
// var dyRouter = require('../dyLoad/astTransformRouter.1')

var fs = require('fs')
var path = require('path')

const babelParser = require('@babel/parser')
const babelTraverse = require('@babel/traverse').default
const generate = require('babel-generator').default
const t = require('@babel/types')

const replaceInFile = require('replace-in-file')

const author = require('child_process').execSync('whoami').toString().trim()

const config = {
  testBasePath: 'src/__tests__/',
  basePath: 'src/',
  moduleTplPath: './scripts/gulp/codeTemplate/moduleTpl',
  sceneTplPath: './scripts/gulp/codeTemplate/sceneTpl',

  sceneTestTplPath: './scripts/gulp/codeTemplate/sceneTpl/SceneRender-test.js'
}

var appPath = config.basePath + 'core'
var appTestPath = config.testBasePath
var appModulesPath = path.join(config.basePath, 'core/modules')

const existedModuleList = []
fs.readdirSync(appModulesPath).forEach(file => {
  var filePath = path.join(appModulesPath, file)
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

function insertElementInList (arrayFilePath, element) {
  console.log(arrayFilePath)
  const fileContent = fs.readFileSync(arrayFilePath).toString()

  const estree = babelParser.parse(fileContent, {
    sourceType: 'module'
  })
  babelTraverse(estree, {
    enter (path) {
      // console.log(path.node.type)
      if (path.node.type === 'ExportDefaultDeclaration') {
        path.traverse({
          ArrayExpression (path) {
            path.node.elements.push(element)
          }
        })
      }
    }
  })

  const output = generate(estree, { retainLines: true })
  fs.writeFileSync(arrayFilePath, output.code)
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
 * @param sceneName
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
          console.log(chalk.red(`Empty module name`))
          process.exit()
        }

        const modulePath = appPath + '/modules/' + moduleName + '/'
        const existedSceneList = getSceneListUnderModulePath(modulePath)

        sceneName = sceneName.endsWith('Scene') ? sceneName : (sceneName + 'Scene')
        const serviceName = sceneName.replace('Scene', 'Service')
        if (existedSceneList.indexOf(sceneName) !== -1) {
          console.log(chalk.red(`Scene called '${sceneName}' has existed, please change a name or delete the existed one`))
          process.exit()
        }

        const sceneTplPath = config.sceneTplPath
        const sceneDir = appPath + '/modules/' + moduleName + '/' + sceneName
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
      const moduleTplPath = config.moduleTplPath
      const modulePath = appPath + '/modules/' + moduleName
      const moduleIndexPath = appPath + '/modules/index.js'

      execSync(`cp -r ${moduleTplPath} ${modulePath}`)

      fillModuleName(moduleName)

      // 插入模块到模块列表
      const requireCallExpression = t.callExpression(t.identifier('require'), [t.stringLiteral('./' + moduleName)])
      const newMember = t.memberExpression(requireCallExpression, t.identifier('default'))
      insertElementInList(moduleIndexPath, newMember)

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
  const moduleIndexPath = path.join(config.basePath, `core/modules/${moduleName}/index.js`)
  replaceInFile.sync({ files: moduleIndexPath, from: /TplModuleName/g, to: moduleName })

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
