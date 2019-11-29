const fs = require('fs')
const path = require('path')
const execSync = require('../utils/execSync')
const replaceInFile = require('replace-in-file')
const chalk = require('chalk')
const {initEslint} = require('../plugin/eslint')
const shell = require('shelljs')
// const inquirer = require('inquirer')
const env = require('../config/npmConfig')

function init (root, projectName, bundleId, scheme, port = 8081, eslint, template, options) {

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

  if (!scheme) {
    console.warn('scheme invalid')
    return
  }
  // TODO 换到从npm拉取
  let installCommand = `${env.npm_install_xxx} @webank/trident ${process.env.useLocalRegistry ? ' --registry http://localhost:4873' : ''}`
  installCommand += ' --verbose'
  try {
    execSync(installCommand, { stdio: 'inherit' })

    const appSeedPath = path.join(root, 'node_modules/@webank/trident/app-seed')
    execSync(`cp -r ${appSeedPath}/. ./`, { stdio: 'inherit' })

    process.chdir(path.join(root, 'src/modules'))
    execSync(`mv example-${template} example`, { stdio: 'inherit' })
    execSync('rm -rf example-*', { stdio: 'inherit' })
    process.chdir(root)

    // 更换端口
    let tridentConfig = JSON.parse(fs.readFileSync(path.join(root,'trident-config.json'), 'utf8'));
    tridentConfig.port = parseInt(port)
    let newContent = JSON.stringify(tridentConfig, null, 4);
    fs.writeFileSync(path.join(root,'trident-config.json'), newContent, 'utf8')

    // eslint
    if (eslint) {
      initEslint()
    }

    execSync(`${env.npm_install_all} --verbose ${process.env.useLocalRegistry ? ' --registry http://localhost:4873' : ''}`, { stdio: 'inherit' })

    // TODO delay this to ios build phase ?
    process.chdir('ios')
    execSync('pod install --verbose', { stdio: 'inherit' })

    replaceName(root, projectName, bundleId, scheme)
  } catch (err) {
    console.error(err)
    // console.error(`Command \`${installCommand}\` failed.`)
    process.exit(1)
  }
}

function replaceName (root, projectName, bundleId = 'test.cli.bundle', scheme) {
  const targetProjectName = projectName + '.xcodeproj'
  const targetAppName = projectName + '.app'
  const targetWorkspaceName = projectName + '.xcworkspace'
  const targetWorkspaceData = projectName + '.xcworkspace/contents.xcworkspacedata'
  const fastlaneFileName = 'fastlane/Fastfile'
  const bundleName = bundleId

  try {
    // 替换iOS的内容
    process.chdir(root)
    if (fs.existsSync('ios/trident.xcodeproj')) {
      execSync('mv ios/trident.xcodeproj ios/' + targetProjectName)
    }
    if (fs.existsSync('ios/trident.xcworkspace')) {
      execSync('mv ios/trident.xcworkspace ios/' + targetWorkspaceName)
    }

    let changes = replaceInFile.sync({
      files: './ios/' + targetWorkspaceData,
      from: /trident.xcodeproj/g,
      to: targetProjectName,
    })
    console.log('Modified files:', changes.join(', '))

    changes = replaceInFile.sync({
      files: './ios/' + targetWorkspaceData,
      from: /trident.app/g,
      to: targetAppName,
    })
    console.log('Modified files:', changes.join(', '))

    // /ios/trident.xcodeproj/xcshareddata/xcschemes/Build.xcscheme
    changes = replaceInFile.sync({
      files: [
        './ios/' + targetProjectName + '/xcshareddata/xcschemes/Build.xcscheme',

        // Splash Screen Text
        './ios/trident/Base.lproj/LaunchScreen.xib',

        // Splash Screen Text
        './ios/trident/Info.plist'
      ],
      from: /trident/g,
      to: projectName,
    })
    console.log('Modified files:', changes.join(', '))

    changes = replaceInFile.sync({
      files: [
        './ios/trident/Info.plist'
      ],
      from: /demo-scheme/g,
      to: scheme,
    })
    console.log('Modified files:', changes.join(', '))

    if (bundleName) {
      // replace bundle id
      const changes = replaceInFile.sync({
        files: './ios/' + targetProjectName + '/project.pbxproj',
        from: /org.reactjs.native.example/g,
        to: bundleName,
      })
      console.log('Modified files:', changes.join(', '))
    }

    // replace bundle id
    changes = replaceInFile.sync({
      files: './' + fastlaneFileName,
      from: /trident/g,
      to: projectName,
    })
    console.log('Modified files:', changes.join(', '))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  // 替换Android的内容
  changes = replaceInFile.sync({
    files: [
      './android/app/build.gradle',
      './android/app/src/main/AndroidManifest.xml',
      './android/app/src/main/java/io/unpourtous/trident/MainApplication.java',
      './android/app/BUCK'
    ],
    from: /org.reactnative.example/g,
    to: bundleId,
  })
  console.log('Modified files:', changes.join(', '))

  changes = replaceInFile.sync({
    files: [
      './android/app/src/main/AndroidManifest.xml'
    ],
    from: /demo-scheme/g,
    to: scheme,
  })
  console.log('Modified files:', changes.join(', '))

  changes = replaceInFile.sync({
    files: [
      './app.json',
      './android/app/src/main/res/values/strings.xml', // 最终App的名字
      './android/settings.gradle', // Android工程项目名字
      './android/app/build.gradle', // 打包输出的apk文件名,

      // rn root component的名字
      './android/app/src/main/java/io/unpourtous/trident/MainActivity.java',
      './ios/trident/AppDelegate.m'
    ],
    from: /app-seed/g,
    to: projectName,
  })
  console.log('Modified files:', changes.join(', '))
}

module.exports = {
  init
}
