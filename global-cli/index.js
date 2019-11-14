#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const execSync = (cmd) => require('child_process').execSync(cmd, {stdio: 'inherit'})
const options = require('minimist')(process.argv.slice(2))
const npmConfig = require('./npmConfig')
const commander = require('commander')
const semver = require('semver')
const inquirer = require('inquirer');
const program = new commander.Command();

const isDevMode = !(process.env.npmClient === undefined && process.env.useLocal === undefined)
if (!['npm', 'wnpm', 'yarn'].includes(process.env.npmClient)) {
  process.env.npmClient = 'wnpm'
}
process.env.useLocal = process.env.useLocal === undefined ? 'false' : process.env.useLocal

const chalk = require('chalk')

// TODO =========================新版命令行==================================
let cli
let cliPath = CLI_MODULE_PATH()
if (fs.existsSync(cliPath)) {
  cli = require(cliPath)
}
let commands = options._
const { check, processCheckResult } = require('./env/index.js')
const checkResult = check()

const requiredVersion = require('./package.json').engines.node

function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'trident-cli')

program
.version(require('./package.json').version)
.description('A trident project')
// 此库目前这里有问题暂时用自定义提示
//.command('init', 'init trident project', { executableFile: '' }).alias('i')
.on('--help', function(){
  console.log('');
  console.log('Commands:');
  console.log(' init         init trident project');
})
.action((value, cmd) => {
  switch (value) {
    case 'init':
      initProject()
      break
    default:
      program.help()
  }
})

program.parse(process.argv)

function initProject () {
  const promptList = [
    {
      type: 'input',
      message: '请输入项目名称(Please enter project name):',
      name: 'name',
      default: "tridentDemo",
      validate: function(value) {
        if (value.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
          return true;
        } else if (value === 'React') {
          return `${value}is not a valid name for a project. Please do not use the reserved word "React".`;
        } else {
          return `'${value} is not a valid name for a project. Please use a valid identifier name (alphanumeric).`
        }
      }
    }, {
      type: 'input',
      message: '请输入bundleId(Please enter bundleId):',
      name: 'bundleId',
      default: "com.trident.demo"
    }, {
      type: 'input',
      message: '请输入scheme(Please enter scheme):',
      name: 'scheme',
      default: "tridentDemo"
    }, {
      type: 'input',
      message: '请输入远程调试端口(Please enter remote debug port):',
      name: 'port',
      default: 8082
    }, {
      type: "confirm",
      message: "是否使用eslint？(use eslint?)",
      name: "eslint"
    }
  ];
  // 先检查环境是否支持，引导安装
  if (checkResult.length > 0) {
    processCheckResult(checkResult).then(() => {
      inquirer.prompt(promptList).then(answers => {
        console.log(answers);
        const {name, bundleId, scheme, port, eslint} = answers
        createProject(name, bundleId, scheme, port, eslint, options)
      })
    }, () => {
      // console.log
    })
  } else {
    inquirer.prompt(promptList).then(answers => {
      const {name, bundleId, scheme, port, eslint} = answers
      createProject(name, bundleId, scheme, port, eslint, options)
    })
  }
}

function printVersionsAndExit (reactNativePackageJsonPath) {
  console.log('trident-cli: ' + require('./package.json').version)
  try {
    console.log('trident: ' + require(reactNativePackageJsonPath).version)
  } catch (e) {
    console.log('trident: n/a - not inside a Trident project directory')
  }
  process.exit()
}

/**
 * package.json路径
 * @return {string}
 */
function REACT_NATIVE_PACKAGE_JSON_PATH () {
  return path.resolve(
    process.cwd(),
    'node_modules',
    '@webank',
    'trident',
    'package.json'
  )
}

/**
 * 运行命令的路径
 * @return {string}
 */
function CLI_MODULE_PATH () {
  // TODO 本地调试用，在trident/libraryDev/中引用 trident/local-cli/index.js
  if (process.env.useLocal === 'true') {
    // 本地开发调试时使用
    console.log(process.env)
    return path.resolve(
      process.cwd(),
      '..',
      'local-cli',
      'index.js'
    )
  } else {
    // 外网使用，引用 tridentApp/node_modules/@webank/trident/local-cli/index.js
    return path.resolve(
      process.cwd(),
      'node_modules',
      '@webank',
      'trident',
      'local-cli',
      'index.js'
    )
  }
}


/**
 * create a new project
 * @param name project name
 * @param bundleId project bundleId
 * @param scheme project scheme
 * @param port project port
 * @param options arguments
 */
function createProject (name, bundleId, scheme, port, eslint, options) {
  var root = path.resolve(name)
  var projectName = path.basename(root)

  console.log(
    'This will walk you through creating a new React Native project in',
    root
  )

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  var packageJson = {
    name: projectName,
    version: '0.0.1',
    private: true,
    scripts: {
      start: 'node node_modules/react-native/local-cli/cli.js start'
    }
  }
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson))
  process.chdir(root)

  createNewProject(root, projectName, bundleId, scheme, port, eslint, options)
}

/**
 * 下载trident用于创建项目
 * @param root
 * @param projectName
 * @param bundleId
 * @param scheme
 * @param port
 * @param eslint
 * @param options
 */
function createNewProject (root, projectName, bundleId, scheme, port, eslint, options) {
  // 自定义版本
  const rnPackage = options.version
  var installCommand

  installCommand = npmConfig.npm_install_xxx + getInstallPackage(rnPackage) + (process.env.useLocalRegistry ? ' --registry http://localhost:4873' : '')
  if (options.verbose) {
    installCommand += ' --verbose'
  }
  console.log(installCommand + '...')
  try {
    execSync(installCommand, { stdio: 'inherit' })
  } catch (err) {
    console.error(err)
    console.error('Command `' + installCommand + '` failed.')
    process.exit(1)
  }

  // 安装完成这时候一定是有的
  let cliPath = CLI_MODULE_PATH()
  cli = require(cliPath)
  cli.init(root, projectName, bundleId, scheme, port, eslint, options)
}

function getInstallPackage (rnPackage) {
  return '@webank/trident --exact'
}

return
// TODO ===========================end================================

//
//if (isDevMode) {
//  console.log(chalk.green('Trident development env var===================='))
//  console.log('npmClient: ', chalk.green(process.env.npmClient))
//  console.log('useLocal: ', chalk.green(process.env.useLocal))
//  console.log('')
//  console.log('')
//}
//
///**
// * 运行命令的路径
// * @return {string}
// */
//var CLI_MODULE_PATH = function () {
//  // TODO 本地调试用，在trident/libraryDev/中引用 trident/local-cli/index.js
//  if (process.env.useLocal === 'true') {
//    // 本地开发调试时使用
//    return path.resolve(
//      process.cwd(),
//      '..',
//      'local-cli',
//      'index.js'
//    )
//  } else {
//    // 外网使用，引用 tridentApp/node_modules/@webank/trident/local-cli/index.js
//    return path.resolve(
//      process.cwd(),
//      'node_modules',
//      '@webank',
//      'trident',
//      'local-cli',
//      'index.js'
//    )
//  }
//}
//
///**
// * package.json路径
// * @return {string}
// */
//var REACT_NATIVE_PACKAGE_JSON_PATH = function () {
//  return path.resolve(
//    process.cwd(),
//    'node_modules',
//    '@webank',
//    'trident',
//    'package.json'
//  )
//}
//
//// 基础命令
//// --help
//if (options._.length === 0 && (options.h || options.help)) {
//  printUsageGuide()
//  process.exit(0)
//}
//
//// --version
//if (options._.length === 0 && (options.v || options.version)) {
//  printVersionsAndExit(REACT_NATIVE_PACKAGE_JSON_PATH())
//  process.exit(0)
//}
//
//var cli
//var cliPath = CLI_MODULE_PATH()
//if (fs.existsSync(cliPath)) {
//  cli = require(cliPath)
//}
//
//var commands = options._
//const { check, processCheckResult } = require('./env/index.js')
//const checkResult = check()
//
//// 如果在Trident项目外，理论上说只需要支持 --version 和 init命令
//switch (commands[0]) {
//  case 'init': {
//    const startCreateProject = () => {
//      if (!options.name) {
//        console.error(
//          'Usage: trident-cli init --name=$projectName [--verbose]'
//        )
//        process.exit(1)
//      } else {
//        const projectName = options.name
//
//        // TODO
//        validateProjectName(projectName)
//
//        if (fs.existsSync(projectName)) {
//          console.log(`${projectName} already existed, please remove it before create a new one `)
//        } else {
//          createProject(projectName, options)
//        }
//      }
//    }
//    // 先检查环境是否支持，引导安装
//    if (checkResult.length > 0) {
//      processCheckResult(checkResult).then(() => {
//        startCreateProject()
//      }, () => {
//        // console.log
//      })
//    } else {
//      startCreateProject()
//    }
//    break
//  }
//  case 'env': {
//    if (checkResult.length > 0) {
//      logError(checkResult)
//    } else {
//      console.log(chalk.green('Everything is OK!'))
//    }
//    break
//  }
//  default:
//    if (cli) { // 如果在Trident项目内，所有命令由local-cli接管
//      cli.run(path.resolve(options.name || '.'))
//    } else {
//      console.error(
//        'Command `%s` unrecognized. ' +
//        'Make sure that you are inside a trident project.',
//        commands[0]
//      )
//      process.exit(1)
//    }
//    break
//}
//
//function validateProjectName (name) {
//  if (!String(name).match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
//    console.error(
//      '"%s" is not a valid name for a project. Please use a valid identifier ' +
//      'name (alphanumeric).',
//      name
//    )
//    process.exit(1)
//  }
//
//  if (name === 'React') {
//    console.error(
//      '"%s" is not a valid name for a project. Please do not use the ' +
//      'reserved word "React".',
//      name
//    )
//    process.exit(1)
//  }
//}
//
///**
// * print usage guide for trident-cli
// */
//function printUsageGuide () {
//  console.log([
//    '',
//    '  Usage: trident [command] [options]',
//    '',
//    '',
//    '  Commands:',
//    '',
//    '    init <ProjectName> [options]  generates a new project and installs its dependencies',
//    '',
//    '  Options:',
//    '',
//    '    -h, --help    output usage information',
//    '    -v, --version output the version number',
//    '',
//  ].join('\n'))
//}
//
///**
// * create a new project
// * @param name project name
// * @param options arguments
// */
//function createProject (name, options) {
//  var root = path.resolve(name)
//  var projectName = path.basename(root)
//
//  console.log(
//    'This will walk you through creating a new React Native project in',
//    root
//  )
//
//  if (!fs.existsSync(root)) {
//    fs.mkdirSync(root)
//  }
//
//  var packageJson = {
//    name: projectName,
//    version: '0.0.1',
//    private: true,
//    scripts: {
//      start: 'node node_modules/react-native/local-cli/cli.js start'
//    }
//  }
//  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson))
//  process.chdir(root)
//
//  createNewProject(root, projectName, options)
//}
//
///**
// * 下载trident用于创建项目
// * @param root
// * @param projectName
// * @param options
// */
//function createNewProject (root, projectName, options) {
//  // 自定义版本
//  const rnPackage = options.version
//  var installCommand
//  console.log('Installing ' + getInstallPackage(rnPackage) + '...')
//
//  installCommand = npmConfig.npm_install_xxx + getInstallPackage(rnPackage)
//  if (options.verbose) {
//    installCommand += ' --verbose'
//  }
//  try {
//    execSync(installCommand, { stdio: 'inherit' })
//  } catch (err) {
//    console.error(err)
//    console.error('Command `' + installCommand + '` failed.')
//    process.exit(1)
//  }
//  // checkNodeVersion();
//
//  // 安装完成这时候一定是有的
//  cli = require(CLI_MODULE_PATH())
//  cli.init(root, projectName, options.bundleId, options.scheme, options)
//}
//
//function getInstallPackage (rnPackage) {
//  // var packageToInstall = '@webank/trident';
//  // var isValidSemver = semver.valid(rnPackage);
//  // if (isValidSemver) {
//  //   packageToInstall += '@' + isValidSemver;
//  // } else if (rnPackage) {
//  // for tar.gz or alternative paths
//  // packageToInstall = rnPackage;
//  // }
//  // return packageToInstall;
//  return '@webank/trident --exact'
//}
//
//function printVersionsAndExit (reactNativePackageJsonPath) {
//  console.log('trident-cli: ' + require('./package.json').version)
//  try {
//    console.log('trident: ' + require(reactNativePackageJsonPath).version)
//  } catch (e) {
//    console.log('trident: n/a - not inside a Trident project directory')
//  }
//  process.exit()
//}
