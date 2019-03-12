#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const execSync = require('child_process').execSync
const chalk = require('chalk')
const prompt = require('prompt')
const semver = require('semver')
const replaceInFile = require('replace-in-file')

const options = require('minimist')(process.argv.slice(2))

console.log(options)

const mainCmd = options._[0]
const root = options.name
switch (mainCmd) {
  case 'init': {
    _init()
    break
  }
  case 'custom': {
    _custom()
  }
}

function _init () {
  const packageJson = {
    name: options.name,
    version: '0.0.1',
    private: true,
    scripts: {}
  }
  var shell = require('shelljs')

  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.exit(1)
  }

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson),
  )

  process.chdir(root)

  let installCommand = `npm install https://github.com/erichua23/soga.git --exact`
  installCommand += ' --verbose'

  try {
    execSync(installCommand, { stdio: 'inherit' })

    execSync('cp -r node_modules/@unpourtous/trident/app-seed/* ./', { stdio: 'inherit' })

    execSync('yarn --verbose', { stdio: 'inherit' })

    process.chdir('ios')

    execSync('pod install --verbose', { stdio: 'inherit' })

    //   try {
    //     const changes = replaceInFile.sync({
    //       files: './trident.xcodeproj/project.pbxproj',
    //       from: /org.reactjs.native.example/g,
    //       to: 'test.erichua.bundleid',
    //     })
    //     console.log('Modified files:', changes.join(', '))
    //   } catch (error) {
    //     console.error('Error occurred:', error)
    //   }
    process.chdir('../../')
    _custom()
  } catch (err) {
    console.error(err)
    console.error(`Command \`${installCommand}\` failed.`)
    process.exit(1)
  }
}

function _custom () {
  process.chdir(root + '/ios')
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
    console.error(`Command \`${installCommand}\` failed.`)
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

