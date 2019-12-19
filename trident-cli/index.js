#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const execSync = (cmd) => require('child_process').execSync(cmd, { stdio: 'inherit' })
const options = require('minimist')(process.argv.slice(2))
const npmConfig = require('./npmConfig')
const commander = require('commander')
const semver = require('semver')
const inquirer = require('inquirer')
const program = new commander.Command()

if (!['npm', 'wnpm', 'yarn'].includes(process.env.npmClient)) {
  process.env.npmClient = 'npm'
}
process.env.useLocal = process.env.useLocal === undefined ? 'false' : process.env.useLocal

const chalk = require('chalk')

let cli
const cliPath = CLI_MODULE_PATH()
if (fs.existsSync(cliPath)) {
  cli = require(cliPath)
}
const commands = options._
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
// .version(require('./package.json').version)
  .description('A trident project')
  // 此库目前这里有问题暂时用自定义提示
  // .command('init', 'init trident project', { executableFile: '' }).alias('i')
  .on('--help', function () {
    console.log(`Commands:
  init         init trident project
  env          check the environment required for the project
  `)
  })
  .action((value, cmd) => {
    switch (value) {
      case 'init':
        initProject()
        break
      case 'env':
        if (checkResult.length > 0) {
          console.log(chalk.red('Error:'))
          logError(checkResult)
        } else {
          console.log(chalk.green('Everything is OK!'))
        }
        break
      case 'help':
        program.help()
        break
      case 'version':
        printVersionsAndExit()
        break
      case 'install':
        try {
          const wtPackage = require(path.resolve(process.cwd(), 'package.json'))
          if (wtPackage.dependencies && wtPackage.dependencies['@webank/trident']) {
            require('./install').installAll()
          } else {
            console.log(chalk.red('Make sure that you are inside a trident project.'))
          }
        } catch (e) {
          console.log(chalk.red('Make sure that you are inside a trident project.'))
        }
        break
      default:
        if (cli) { // 如果在Trident项目内，所有命令由local-cli接管
          cli.run(path.resolve(options.name || '.'))
        } else {
          console.error(
            'Command `%s` unrecognized. ' +
            'Make sure that you are inside a trident project.',
            commands[0]
          )
          process.exit(1)
        }
        break
    }
  })

program.parse(process.argv)

function initProject () {
  const promptList = [
    {
      type: 'input',
      message: '请输入项目名称(Please enter project name):',
      name: 'name',
      default: 'tridentDemo',
      validate: function (value) {
        if (value.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
          return true
        } else if (value === 'React') {
          return `${value}is not a valid name for a project. Please do not use the reserved word "React".`
        } else {
          return `'${value} is not a valid name for a project. Please use a valid identifier name (alphanumeric).`
        }
      }
    }, {
      type: 'input',
      message: '请输入bundleId(Please enter bundleId):',
      name: 'bundleId',
      default: 'com.trident.demo'
    }, {
      type: 'input',
      message: '请输入scheme(Please enter scheme):',
      name: 'scheme',
      default: 'tridentDemo'
    }, {
      type: 'confirm',
      message: '是否使用eslint？(use eslint?)',
      name: 'eslint'
    }, {
      type: 'list',
      message: '请选择模板(Please choose a template?):',
      choices: ['tab', 'default'],
      name: 'template',
      default: 'tab'
    }
  ]
  // 如果使用命令行优先用命令行参数
  const _filterPromptList = promptList.filter(item => !options[item.name])
  // 先检查环境是否支持，引导安装
  if (checkResult.length > 0) {
    processCheckResult(checkResult).then(() => {
      inquirer.prompt(_filterPromptList).then(answers => {
        const {
          name = answers.name,
          bundleId = answers.bundleId,
          scheme = answers.scheme,
          port = 8081,
          eslint = answers.eslint,
          template = answers.template
        } = options || answers
        createProject({ name, bundleId, scheme, port, eslint, options, template })
      })
    }, () => {
      // console.log
    })
  } else {
    inquirer.prompt(_filterPromptList).then(answers => {
      const {
        name = answers.name,
        bundleId = answers.bundleId,
        scheme = answers.scheme,
        port = answers.port,
        eslint = answers.eslint,
        template = answers.template
      } = options || answers
      createProject({ name, bundleId, scheme, port, eslint, options, template })
    })
  }
}

function printVersionsAndExit () {
  console.log('trident-cli: ' + require('./package.json').version)
  try {
    const wtPackage = require(path.resolve(process.cwd(), 'package.json'))
    if (wtPackage.dependencies && wtPackage.dependencies['@webank/trident']) {
      console.log('trident: ' + wtPackage.dependencies['@webank/trident'])

      if (!fs.existsSync(path.resolve(process.cwd(), 'node_modules', '@webank', 'trident', 'package.json'))) {
        console.log(chalk.yellow('Dependencies not installed, use "tdt install" to install all dependencies'))
      }
    } else {
      console.log('trident: n/a - not inside a Trident project directory')
    }
  } catch (e) {
    console.log('trident: n/a - not inside a Trident project directory')
  }
  process.exit()
}
/**
 * 运行命令的路径
 * @return {string}
 */
function CLI_MODULE_PATH () {
  // TODO 本地调试用，在trident/libraryDev/中引用 trident/local-cli/index.js
  if (process.env.useLocal === 'true') {
    // 本地开发调试时使用
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
function createProject ({ name, bundleId, scheme, port, eslint, options, template }) {
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
    scripts: {}
  }
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson))
  process.chdir(root)

  createNewProject(root, options, { projectName, bundleId, scheme, port, eslint, template })
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
function createNewProject (root, options, { projectName, bundleId, scheme, port, eslint, template }) {
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
  const cliPath = CLI_MODULE_PATH()
  cli = require(cliPath)
  cli.init(root, projectName, bundleId, scheme, port, eslint, template, options)
}

function getInstallPackage () {
  return '@webank/trident --exact --verbose'
}

function logError (...args) {
  if (args.length === 1 && args[0] instanceof Error) {
    var err = args[0]
    console.error('Error: "' + err.message + '".  Stack:\n' + err.stack)
  } else {
    console.error.apply(console, args)
  }
}
