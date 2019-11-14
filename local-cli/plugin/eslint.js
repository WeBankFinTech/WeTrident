const fs = require('fs')
const path = require('path')
const execSync = (cmd) => require('child_process').execSync(cmd, {stdio: 'inherit'})
const replaceInFile = require('replace-in-file')
const chalk = require('chalk')

const shell = require('shelljs')
// const inquirer = require('inquirer')
const env = require('../config/npmConfig')

function initEslint () {
  // 生成eslint 并初始化git 添加hook
  execSync(`mkdir githooks`)
  fs.writeFileSync(path.join('./githooks','pre-commit'), githook, {encoding: 'utf-8', mode: 0o766})
  fs.writeFileSync(path.join('.eslintrc.json'), eslintrc, {encoding: 'utf-8', mode: 0o766})
  execSync(`git init`)
  execSync(`git config core.hooksPath ./githooks`)
}

const githook = `#!/bin/sh

# 确保将要提交的所有 JavaScript 代码通过 standard 规范的检查

RESULT1=0

checkNewAppStyle () {
  git diff --name-only --cached --relative | grep 'src/.*\\.js\\?$' | xargs ./node_modules/eslint/bin/eslint.js -c ./.eslintrc.json --parser babel-eslint
  RESULT1=$?
}
checkNewAppStyle

if [[ (($RESULT1 != 0)) ]]; then exit 1; fi
`

const eslintrc = `{
  "parser": "babel-eslint",
  "extends": ["standard", "standard-jsx"]
}
`

module.exports = {
  initEslint
}
