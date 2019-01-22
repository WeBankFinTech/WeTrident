// var commonArgsDesc = require('./config/commonArgsDesc')
var execSync = (cmd) => {
  require('child_process').execSync(cmd, {stdio: [0, 1, 2]})
}
var chalk = require('chalk')
var inquirer = require('inquirer')
var _ = require('lodash')
var dyRouter = require('../dyLoad/astTransformRouter.1')

var fs = require('fs')
var path = require('path')

var config = {
  testBasePath: 'src/__tests__/',
  basePath: 'src/',
  appName: '.',
  moduleTplPath: './scripts/gulp/codeTemplate/moduleTpl',
  sceneTplPath: './scripts/gulp/codeTemplate/sceneTpl',
  sceneTestTplPath: './scripts/gulp/codeTemplate/sceneTpl/SceneRender-test.js'
}

var appPath = config.basePath + 'apps/' + config.appName
var appTestPath = config.testBasePath
var appModulesPath = config.basePath + 'apps/' + config.appName + '/modules'

const getModuleList = (appModulesPath) => {
  const moduleList = []
  fs.readdirSync(appModulesPath).forEach(file => {
    var filePath = path.join(appModulesPath, file)
    var stat = fs.statSync(filePath)
    if (stat.isDirectory(filePath)) {
      moduleList.push(file)
    }
  })
  return moduleList
}

const getSceneListUnderModulePath = (modulesPath) => {
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

var getAllFileUnderDir = function (dir, fileList = []) {
  var files = fs.readdirSync(dir)
  fileList = fileList || []
  files.forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = getAllFileUnderDir(path.join(dir, file), fileList)
    } else {
      fileList.push(path.join(dir, file))
    }
  })
  return fileList
}

var fse = require('fs-extra')
var hogan = require('hogan.js')
var renderTemplate = (templateFileAbsPath, content, targetFileAbsPath, cb) => {
  fse.readFile(templateFileAbsPath, (err, data) => {
    if (!err) {
      var contentInString = data.toString()
      var template = hogan.compile(contentInString)
      var result = template.render(content)
      fse.writeFileSync(targetFileAbsPath, result, 'utf8')
      console.log(chalk.green(`${targetFileAbsPath} generated successfully!`))
      cb && cb()
    }
  })
}
var existedModuleList = getModuleList(appModulesPath)

const tmpExecSync = require('child_process').execSync
var author = tmpExecSync('whoami').toString().trim()
const prefix = `*/`
const _generatorScene = (moduleName) => {
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
        let {sceneName} = answers
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
        const scenePath = appPath + '/modules/' + moduleName + '/' + sceneName
        execSync(`cp -r ${sceneTplPath} ${scenePath}`)
        execSync(`mv ${path.join(scenePath, 'Scene')}.js ${path.join(scenePath, sceneName)}.js`)
        execSync(`mv ${path.join(scenePath, 'Service')}.js ${path.join(scenePath, serviceName)}.js`)

        // 开始替换
        const allFileUnderScenePath = getAllFileUnderDir(scenePath)

        allFileUnderScenePath.forEach(filePath => {
          renderTemplate(filePath, {
            author: author,
            createTime: new Date().toISOString(),
            sceneName,
            serviceName
          }, filePath)
        })

        // 生成测试用例
        const sceneTestTplPath = config.sceneTestFilePath
        if (!fs.existsSync(appTestPath + 'modules/' + moduleName)) {
          fs.mkdirSync(appTestPath + 'modules/' + moduleName)
        }
        const sceneTestFilePath = appTestPath + 'modules/' + moduleName + '/' + sceneName + '-test.js'
        execSync(`cp -r ${sceneTestTplPath} ${sceneTestFilePath}`)
        renderTemplate(sceneTestFilePath, {
          author: author,
          createTime: new Date().toISOString(),
          sceneName,
          serviceName,
          moduleName
        }, sceneTestFilePath)

        const insertImport = `${prefix}import ${sceneName} from './${sceneName}'
/* {{&insertImport}}`

        // 插入reducer
        const combineReducersFilePath = modulePath + '/combineReducers.js'
        const insertReducerItem = `${prefix}[${sceneName}]: ${sceneName}.reducer,
  /* {{&insertReducerItem}}`
        renderTemplate(combineReducersFilePath, {insertReducerItem, insertImport}, combineReducersFilePath)

        // 插入路由
        const routerFilePath = modulePath + '/routers.js'
        const insertRouterItem = `${prefix}[${sceneName}]: {
    screen: ${sceneName},
    navigationOptions: () => ({
      title: '${sceneName}'
    })
  },
  /* {{&insertRouterItem}}`
        renderTemplate(routerFilePath, {insertRouterItem, insertImport}, routerFilePath, () => {
          // 创建scene时自动更新模块的动态路由
          dyRouter.generateModuleDyRouter(moduleName)
        })

        setTimeout(() => {
          // inquirer.prompt([{
          //   type: 'confirm',
          //   message: chalk.green(`\nContinue create more Scene (module: ${moduleName}) ? \n`),
          //   name: 'continueCreateScene'
          // }]).then(answers => {
          //   if (answers.continueCreateScene) {
          _generatorScene(moduleName)
          //   }
          // })
        }, 500)
      }, () => {
        console.log(chalk.red('Input Scene name error!'))
      })
    }
  }, 500)
}

var _generatorModule = function () {
  setTimeout(() => {
    inquirer.prompt([{
      type: 'input',
      message: chalk.green('\nPlease input your module name !\n'),
      name: 'moduleName'
    }]).then(answers => {
      let {moduleName} = answers

      moduleName = _.camelCase(moduleName)
      if (existedModuleList.indexOf(moduleName) !== -1) {
        console.log(chalk.red(`Module called '${moduleName}' has existed, please change a name or delete the existed one`))
        process.exit()
      }

      if (!moduleName) {
        console.log(chalk.red(`Empty module name`))
        process.exit()
      }
      // TODO 输入检查
      const moduleTplPath = config.moduleTplPath
      const modulePath = appPath + '/modules/' + moduleName
      execSync(`cp -r ${moduleTplPath} ${modulePath}`)

      // 开始替换
      const allFileUnderModule = getAllFileUnderDir(modulePath)
      allFileUnderModule.forEach(filePath => {
        renderTemplate(filePath, {
          author: author,
          createTime: new Date().toISOString(),
          insertRouterItem: '{{&insertRouterItem}}',
          insertReducerItem: '{{&insertReducerItem}}',
          insertConstantItem: '{{&insertConstantItem}}',
          insertModuleReducer: '{{&insertModuleReducer}}',
          insertModuleRouter: '{{&insertModuleRouter}}',
          insertImport: '{{&insertImport}}',
          moduleName
        }, filePath)
      })
      const appReducerPath = path.join(appModulesPath, 'reducer.js')
      const appRouterPath = path.join(appModulesPath, 'routers.js')

      const insertImportModule = `${prefix}import ${moduleName} from './${moduleName}'
/* {{&insertImportModule}}`

      // 插入reducer
      const insertModuleReducer = `${prefix}[${moduleName}]: ${moduleName}.reducer,
  /* {{&insertModuleReducer}}`
      renderTemplate(appReducerPath, {insertImportModule, insertModuleReducer}, appReducerPath)

      // 插入router
      const insertModuleRouter = `${prefix}[${moduleName}]: ${moduleName}.routers,
  /* {{&insertModuleRouter}}`
      renderTemplate(appRouterPath, {insertImportModule, insertModuleRouter}, appRouterPath, () => {
        // 创建module的时候同时更新全局的dyRouter配置
        dyRouter.generateGlobalDyRouter()
      })

      // 提示是否继续创建Scene
      setTimeout(() => {
        _generatorScene(moduleName)
      }, 300)
    }, () => {
      console.log('Input error!!')
    })
  }, 500)
}
const generatorScene = () => {
  _generatorScene()
}
generatorScene.description = chalk.green('Create a Scene in a specified module from code template !')

const generatorModule = () => {
  _generatorModule()
}
generatorModule.description = chalk.green('Create a new module from code template !')

module.exports = {
  generatorModule,
  generatorScene
}
