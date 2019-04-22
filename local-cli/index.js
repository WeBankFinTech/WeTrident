#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync
const replaceInFile = require('replace-in-file')
const options = require('minimist')(process.argv.slice(2))
const shell = require('shelljs')

function run (root) {
  console.log(options)

  const cmd = options._[0]

  switch (cmd) {
    case 'init': {
      const projectName = options._[1]
      _init(root, projectName)
    }
  }
}
function _init (root, projectName) {
  const packageJson = {
    name: options.name,
    version: '0.0.1',
    private: true,
    scripts: {}
  }

  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.exit(1)
  }

  // if (!fs.existsSync(root)) {
  //   fs.mkdirSync(root)
  // }
  //
  // fs.writeFileSync(
  //   path.join(root, 'package.json'),
  //   JSON.stringify(packageJson),
  // )

  // process.chdir(root)
  //
  // let installCommand = `npm install https://github.com/erichua23/soga.git --exact`
  // installCommand += ' --verbose'

  try {
    // execSync(installCommand, { stdio: 'inherit' })

    const appSeedPath = path.join(root, 'node_modules/@unpourtous/trident/app-seed')
    execSync(`cp -r ${appSeedPath}/* ./`, { stdio: 'inherit' })

    execSync('yarn --verbose', { stdio: 'inherit' })

    process.chdir('ios')

    execSync('pod install --verbose', { stdio: 'inherit' })

    process.chdir('../../')
    _custom(root)
  } catch (err) {
    console.error(err)
    // console.error(`Command \`${installCommand}\` failed.`)
    process.exit(1)
  }
}

function _custom (root) {
  process.chdir(path.join(root, 'ios'))
  const projectName = options.name
  const targetProjectName = options.name + '.xcodeproj'
  const targetAppName = options.name + '.app'
  const targetWorkspaceName = options.name + '.xcworkspace'
  const targetWorkspaceData = options.name + '.xcworkspace/contents.xcworkspacedata'
  const fastlaneFileName = 'fastlane/Fastfile'
  const bundleName = options.bundleId

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
      to: options.name,
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
    to: options.bundleId,
  })
  console.log('bundle Modified files:', changes.join(', '))
}

module.exports = {
  init: _init,
  run
}

