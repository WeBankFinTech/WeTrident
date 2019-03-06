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
    }
  }
  var shell = require('shelljs');

  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  }

  const root = options.name

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson),
  );

  process.chdir(root);

  let installCommand = `yarn add https://github.com/erichua23/soga.git --exact`;
  if (options.verbose) {
    installCommand += ' --verbose';
  }

  try {
    execSync(installCommand, {stdio: 'inherit'});

    execSync('cp -r node_modules/@unpourtous/trident/app-seed/* ./', {stdio: 'inherit'});

    execSync('yarn', {stdio: 'inherit'});
  } catch (err) {
    console.error(err);
    console.error(`Command \`${installCommand}\` failed.`);
    process.exit(1);
  }
}

function _custom () {

}
