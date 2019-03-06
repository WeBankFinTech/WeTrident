#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const prompt = require('prompt');
const semver = require('semver');

const options = require('minimist')(process.argv.slice(2));

console.log(options)

const mainCmd = options._[0]

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
    scripts: {
      start: 'react-native start',
      ios: 'react-native run-ios',
      android: 'react-native run-android',
    }
  }
  var shell = require('shelljs');

  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  }
}

function _custom () {

}
//
// const getCliPath = function() {
//   return path.resolve(process.cwd(), 'node_modules', 'react-native', 'cli.js');
// };
//
// const getRNPkgJsonPath = function() {
//   return path.resolve(
//     process.cwd(),
//     'node_modules',
//     'react-native',
//     'package.json',
//   );
// };
//
// if (options._.length === 0 && (options.v || options.version)) {
//   printVersionsAndExit(getRNPkgJsonPath());
// }
//
// // Use Yarn if available, it's much faster than the npm client.
// // Return the version of yarn installed on the system, null if yarn is not available.
// function getYarnVersionIfAvailable() {
//   let yarnVersion;
//   try {
//     // execSync returns a Buffer -> convert to string
//     if (process.platform.startsWith('win')) {
//       yarnVersion = (execSync('yarn --version 2> NUL').toString() || '').trim();
//     } else {
//       yarnVersion = (
//         execSync('yarn --version 2>/dev/null').toString() || ''
//       ).trim();
//     }
//   } catch (error) {
//     return null;
//   }
//   // yarn < 0.16 has a 'missing manifest' bug
//   try {
//     if (semver.gte(yarnVersion, '0.16.0')) {
//       return yarnVersion;
//     }
//     return null;
//   } catch (error) {
//     console.error(`Cannot parse yarn version: ${yarnVersion}`);
//     return null;
//   }
// }
//
// let cli;
// const cliPath = getCliPath();
// if (fs.existsSync(cliPath)) {
//   cli = require(cliPath);
// }
//
// const commands = options._;
// if (cli) {
//   cli.run();
// } else {
//   if (
//     (options._.length === 0 && (options.h || options.help)) ||
//     commands.length === 0
//   ) {
//     console.log(
//       [
//         '',
//         '  Usage: react-native [command] [options]',
//         '',
//         '',
//         '  Commands:',
//         '',
//         '    init <ProjectName> [options]  generates a new project and installs its dependencies',
//         '',
//         '  Options:',
//         '',
//         '    -h, --help    output usage information',
//         '    -v, --version use a specific version of React Native',
//         '    --template use an app template. Use --template to see available templates.',
//         '',
//       ].join('\n'),
//     );
//     process.exit(0);
//   }
//
//   switch (commands[0]) {
//     case 'init':
//       if (!commands[1]) {
//         console.error('Usage: react-native init <ProjectName> [--verbose]');
//         process.exit(1);
//       } else {
//         init(commands[1], options);
//       }
//       break;
//     default:
//       console.error(
//         'Command `%s` unrecognized. ' +
//         'Make sure that you have run `npm install` and that you are inside a react-native project.',
//         commands[0],
//       );
//       process.exit(1);
//       break;
//   }
// }
//
// function validateProjectName(name) {
//   if (!String(name).match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
//     console.error(
//       '"%s" is not a valid name for a project. Please use a valid identifier ' +
//       'name (alphanumeric).',
//       name,
//     );
//     process.exit(1);
//   }
//
//   if (name === 'React') {
//     console.error(
//       '"%s" is not a valid name for a project. Please do not use the ' +
//       'reserved word "React".',
//       name,
//     );
//     process.exit(1);
//   }
// }
//
// /**
//  * @param name Project name, e.g. 'AwesomeApp'.
//  * @param options.verbose If true, will run 'npm install' in verbose mode (for debugging).
//  * @param options.version Version of React Native to install, e.g. '0.38.0'.
//  * @param options.npm If true, always use the npm command line client,
//  *                       don't use yarn even if available.
//  */
// function init(name, options) {
//   validateProjectName(name);
//
//   if (fs.existsSync(name)) {
//     createAfterConfirmation(name, options);
//   } else {
//     createProject(name, options);
//   }
// }
//
// function createAfterConfirmation(name, options) {
//   prompt.start();
//
//   const property = {
//     name: 'yesno',
//     message: `Directory ${name} already exists. Continue?`,
//     validator: /y[es]*|n[o]?/,
//     warning: 'Must respond yes or no',
//     default: 'no',
//   };
//
//   prompt.get(property, (err, result) => {
//     if (result.yesno[0] === 'y') {
//       createProject(name, options);
//     } else {
//       console.log('Project initialization canceled');
//       process.exit();
//     }
//   });
// }
//
// function createProject(name, options) {
//   const root = path.resolve(name);
//   const projectName = path.basename(root);
//
//   console.log(
//     'This will walk you through creating a new React Native project in',
//     root,
//   );
//
//   if (!fs.existsSync(root)) {
//     fs.mkdirSync(root);
//   }
//
//   const packageJson = {
//     name: projectName,
//     version: '0.0.1',
//     private: true,
//     scripts: {
//       start: 'react-native start',
//       ios: 'react-native run-ios',
//       android: 'react-native run-android',
//     },
//   };
//   fs.writeFileSync(
//     path.join(root, 'package.json'),
//     JSON.stringify(packageJson),
//   );
//   process.chdir(root);
//
//   run(root, projectName, options);
// }
//
// function getInstallPackage(rnPackage) {
//   let packageToInstall = 'react-native';
//   const isValidSemver = semver.valid(rnPackage);
//   if (isValidSemver) {
//     packageToInstall += `@${isValidSemver}`;
//   } else if (rnPackage) {
//     // for tar.gz or alternative paths
//     packageToInstall = rnPackage;
//   }
//   return packageToInstall;
// }
//
// function run(root, projectName, options) {
//   const rnPackage = options.version; // e.g. '0.38' or '/path/to/archive.tgz'
//   const forceNpmClient = options.npm;
//   const yarnVersion = !forceNpmClient && getYarnVersionIfAvailable();
//   let installCommand;
//   if (options.installCommand) {
//     // In CI environments it can be useful to provide a custom command,
//     // to set up and use an offline mirror for installing dependencies, for example.
//     installCommand = options.installCommand;
//   } else if (yarnVersion) {
//     console.log(`Using yarn v${yarnVersion}`);
//     console.log(`Installing ${getInstallPackage(rnPackage)}...`);
//     installCommand = `yarn add ${getInstallPackage(rnPackage)} --exact`;
//     if (options.verbose) {
//       installCommand += ' --verbose';
//     }
//   } else {
//     console.log(`Installing ${getInstallPackage(rnPackage)}...`);
//     if (!forceNpmClient) {
//       console.log(
//         'Consider installing yarn to make this faster: https://yarnpkg.com',
//       );
//     }
//     installCommand = `npm install --save --save-exact ${getInstallPackage(
//       rnPackage,
//     )}`;
//     if (options.verbose) {
//       installCommand += ' --verbose';
//     }
//   }
//   try {
//     execSync(installCommand, {stdio: 'inherit'});
//   } catch (err) {
//     console.error(err);
//     console.error(`Command \`${installCommand}\` failed.`);
//     process.exit(1);
//   }
//   checkNodeVersion();
//   cli = require(getCliPath());
//   cli.init(root, projectName);
// }
//
// function checkNodeVersion() {
//   const packageJson = require(getRNPkgJsonPath());
//   if (!packageJson.engines || !packageJson.engines.node) {
//     return;
//   }
//   if (!semver.satisfies(process.version, packageJson.engines.node)) {
//     console.error(
//       'You are currently running Node %s but React Native requires %s. ' +
//       'Please use a supported version of Node.\n' +
//       'See https://facebook.github.io/react-native/docs/getting-started.html',
//       process.version,
//       packageJson.engines.node,
//     );
//   }
// }
//
// function printVersionsAndExit(reactNativePackageJsonPath) {
//   console.log(`react-native-cli: ${require('./package.json').version}`);
//   try {
//     console.log(`react-native: ${require(reactNativePackageJsonPath).version}`);
//   } catch (e) {
//     console.log(
//       'react-native: n/a - not inside a React Native project directory',
//     );
//   }
//   process.exit();
// }
