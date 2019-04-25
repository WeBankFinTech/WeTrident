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

var CLI_MODULE_PATH = function () {
  return '/Users/erichua/Projects/UnPourTous/soga/local-cli/index.js'
  // return path.resolve(
  //   process.cwd(),
  //   'node_modules',
  //   '@unpourtous',
  //   'trident',
  //   'local-cli',
  //   'index.js'
  // )
}

var REACT_NATIVE_PACKAGE_JSON_PATH = function () {
  return path.resolve(
    process.cwd(),
    'node_modules',
    '@unpourtous',
    'trident',
    'package.json'
  )
}

if (options._.length === 0 && (options.v || options.version)) {
  printVersionsAndExit(REACT_NATIVE_PACKAGE_JSON_PATH())
}

var cli
var cliPath = CLI_MODULE_PATH()
if (fs.existsSync(cliPath)) {
  cli = require(cliPath)
}

var commands = options._
console.log(options)
if (cli) {
  cli.run(path.resolve(commands[1] || '.'))
} else {
  if (options._.length === 0 && (options.h || options.help)) {
    console.log([
      '',
      '  Usage: trident [command] [options]',
      '',
      '',
      '  Commands:',
      '',
      '    init <ProjectName> [options]  generates a new project and installs its dependencies',
      '',
      '  Options:',
      '',
      '    -h, --help    output usage information',
      '    -v, --version output the version number',
      '',
    ].join('\n'))
    process.exit(0)
  }

  if (commands.length === 0) {
    console.error(
      'You did not pass any commands, run `react-native --help` to see a list of all available commands.'
    )
    process.exit(1)
  }

  switch (commands[0]) {
    case 'init':
      if (!commands[1]) {
        console.error(
          'Usage: react-native init <ProjectName> [--verbose]'
        )
        process.exit(1)
      } else {
        init(commands[1], options)
      }
      break
    default:
      console.error(
        'Command `%s` unrecognized. ' +
        'Make sure that you have run `npm install` and that you are inside a react-native project.',
        commands[0]
      )
      process.exit(1)
      break
  }
}

/**
 * @param name Project name, e.g. 'AwesomeApp'.
 * @param options.verbose If true, will run 'npm install' in verbose mode (for debugging).
 * @param options.version Version of React Native to install, e.g. '0.38.0'.
 * @param options.npm If true, always use the npm command line client,
 *                       don't use yarn even if available.
 */
function init (name, options) {
  // validateProjectName(name)

  if (fs.existsSync(name)) {
    createAfterConfirmation(name, options)
    // execSync('rm -rf test')
    // TODO remove dir
  } else {
    createProject(name, options)
  }
}

function createProject(name, options) {
  var root = path.resolve(name);
  var projectName = path.basename(root);

  console.log(
    'This will walk you through creating a new React Native project in',
    root
  );

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  var packageJson = {
    name: projectName,
    version: '0.0.1',
    private: true,
    scripts: {
      start: 'node node_modules/react-native/local-cli/cli.js start'
    }
  };
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson));
  process.chdir(root);

  run(root, projectName, options);
}

function run(root, projectName, options) {
  const rnPackage = options.version;
  const forceNpmClient = options.npm;
  const yarnVersion = (!forceNpmClient) && getYarnVersionIfAvailable();
  var installCommand;
  if (options.installCommand) {
    // In CI environments it can be useful to provide a custom command,
    // to set up and use an offline mirror for installing dependencies, for example.
    installCommand = options.installCommand;
  } else {
    if (yarnVersion) {
      console.log('Using yarn v' + yarnVersion);
      console.log('Installing ' + getInstallPackage(rnPackage) + '...');
      installCommand = 'yarn add ' + getInstallPackage(rnPackage) + ' --exact';
      if (options.verbose) {
        installCommand += ' --verbose';
      }
    } else {
      console.log('Installing ' + getInstallPackage(rnPackage) + '...');
      if (!forceNpmClient) {
        console.log('Consider installing yarn to make this faster: https://yarnpkg.com');
      }
      installCommand = 'npm install --save --save-exact ' + getInstallPackage(rnPackage);
      if (options.verbose) {
        installCommand += ' --verbose';
      }
    }
  }
  try {
    execSync(installCommand, {stdio: 'inherit'});
  } catch (err) {
    console.error(err);
    console.error('Command `' + installCommand + '` failed.');
    process.exit(1);
  }
  // checkNodeVersion();
  cli = require(CLI_MODULE_PATH());
  cli.init(root, projectName);
}

function getInstallPackage(rnPackage) {
  var packageToInstall = 'react-native';
  var isValidSemver = semver.valid(rnPackage);
  if (isValidSemver) {
    packageToInstall += '@' + isValidSemver;
  } else if (rnPackage) {
    // for tar.gz or alternative paths
    packageToInstall = rnPackage;
  }
  // return packageToInstall;
  // TODO 暂时写死
  return 'https://github.com/erichua23/soga.git --exact'
}

// Use Yarn if available, it's much faster than the npm client.
// Return the version of yarn installed on the system, null if yarn is not available.
function getYarnVersionIfAvailable() {
  var yarnVersion;
  try {
    // execSync returns a Buffer -> convert to string
    if (process.platform.startsWith('win')) {
      yarnVersion = (execSync('yarn --version').toString() || '').trim();
    } else {
      yarnVersion = (execSync('yarn --version 2>/dev/null').toString() || '').trim();
    }
  } catch (error) {
    return null;
  }
  // yarn < 0.16 has a 'missing manifest' bug
  try {
    if (semver.gte(yarnVersion, '0.16.0')) {
      return yarnVersion;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Cannot parse yarn version: ' + yarnVersion);
    return null;
  }
}

function createAfterConfirmation (name, options) {
  prompt.start()

  var property = {
    name: 'yesno',
    message: 'Directory ' + name + ' already exists. Continue?',
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
    default: 'no'
  }

  prompt.get(property, function (err, result) {
    if (result.yesno[0] === 'y') {
      createProject(name, options)
    } else {
      console.log('Project initialization canceled')
      process.exit()
    }
  })
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
