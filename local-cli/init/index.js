const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync
const replaceInFile = require('replace-in-file')
const chalk = require('chalk')

const shell = require('shelljs')
const inquirer = require('inquirer')
const env = require('../env.js')

function init (root, projectName, bundleId) {
  const packageJson = {
    name: projectName,
    version: '0.0.1',
    private: true,
    scripts: {}
  }

  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.exit(1)
  }

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson)
  )

  process.chdir(root)

  inquirer.prompt([{
    type: 'input',
    message: chalk.green('\nPlease input your app\'s scheme in lowercase, without \'://\', like \'trident-app\'\n'),
    name: 'scheme'
  }]).then(answers => {
    const scheme = answers.scheme
    if (!scheme) {
      console.warn('scheme invalid')
      return
    }
    // TODO 换到从npm拉取
    let installCommand = `${env.npm_install_xxx} @webank/trident`
    installCommand += ' --verbose'

    try {
      execSync(installCommand, { stdio: 'inherit' })

      const appSeedPath = path.join(root, 'node_modules/@webank/trident/app-seed')
      execSync(`cp -r ${appSeedPath}/* ./`, { stdio: 'inherit' })

      execSync(`${env.npm_install_all} --verbose`, { stdio: 'inherit' })

      // TODO delay this to ios build phase ?
      process.chdir('ios')
      execSync('pod install --verbose', { stdio: 'inherit' })

      replaceName(root, projectName, bundleId, scheme)
    } catch (err) {
      console.error(err)
      // console.error(`Command \`${installCommand}\` failed.`)
      process.exit(1)
    }
  })
}

function replaceName (root, projectName, bundleId = 'test.cli.bundle', scheme) {
  process.chdir(path.join(root, 'ios'))
  const targetProjectName = projectName + '.xcodeproj'
  const targetAppName = projectName + '.app'
  const targetWorkspaceName = projectName + '.xcworkspace'
  const targetWorkspaceData = projectName + '.xcworkspace/contents.xcworkspacedata'
  const fastlaneFileName = 'fastlane/Fastfile'
  const bundleName = bundleId

  try {
    if (fs.existsSync('trident.xcodeproj')) {
      execSync('mv trident.xcodeproj ' + targetProjectName)
    }
    if (fs.existsSync('trident.xcworkspace')) {
      execSync('mv trident.xcworkspace ' + targetWorkspaceName)
    }

    let changes = replaceInFile.sync({
      files: './' + targetWorkspaceData,
      from: /trident.xcodeproj/g,
      to: targetProjectName,
    })

    console.log('Modified files:', changes.join(', '))

    changes = replaceInFile.sync({
      files: './' + targetWorkspaceData,
      from: /trident.app/g,
      to: targetAppName,
    })
    console.log('Modified files:', changes.join(', '))

    // /ios/trident.xcodeproj/xcshareddata/xcschemes/Build.xcscheme
    changes = replaceInFile.sync({
      files: [
        path.join(targetProjectName, '/xcshareddata/xcschemes/Build.xcscheme'),

        // Splash Screen Text
        'trident/Base.lproj/LaunchScreen.xib',

        // Splash Screen Text
        'trident/Info.plist'
      ],
      from: /trident/g,
      to: projectName,
    })
    console.log('bundle Modified files:', changes.join(', '))

    changes = replaceInFile.sync({
      files: [
        'trident/Info.plist'
      ],
      from: /demo-scheme/g,
      to: scheme,
    })
    console.log('bundle Modified files:', changes.join(', '))

    if (bundleName) {
      // replace bundle id
      const changes = replaceInFile.sync({
        files: './' + targetProjectName + '/project.pbxproj',
        from: /org.reactjs.native.example/g,
        to: bundleName,
      })
      console.log('bundle Modified files:', changes.join(', '))
    }

    // replace bundle id
    process.chdir('..')
    changes = replaceInFile.sync({
      files: fastlaneFileName,
      from: /trident/g,
      to: projectName,
    })
    console.log('bundle Modified files:', changes.join(', '))
  } catch (err) {
    console.error(err)
    // console.error(`Command \`${installCommand}\` failed.`)
    process.exit(1)
  }

  process.chdir('android')
  changes = replaceInFile.sync({
    files: [
      'app/build.gradle',
      'app/src/main/AndroidManifest.xml',
      'app/src/main/java/io/unpourtous/trident/MainApplication.java'
    ],
    from: /org.reactnative.example/g,
    to: bundleId,
  })
  changes = replaceInFile.sync({
    files: [
      'app/src/main/AndroidManifest.xml'
    ],
    from: /demo-scheme/g,
    to: scheme,
  })
  console.log('bundle Modified files:', changes.join(', '))
}

module.exports = {
  init
}