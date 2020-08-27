const fs = require('fs')
const path = require('path')
const execSync = (cmd) => require('child_process').execSync(cmd, { stdio: 'inherit' })
const chalk = require('chalk')

function initEslint () {
  // 生成eslint 并初始化git 添加hook
  if (fs.existsSync('githooks/pre-commit')) {
    console.log(chalk.red('you have exist githooks/pre-commit. Please confirm if the file needs to be created'))
    return
  } else {
    execSync('mkdir githooks')
    fs.writeFileSync(path.join('./githooks', 'pre-commit'), githook, { encoding: 'utf-8', mode: 0o766 })
  }
  if (fs.existsSync('.eslintrc.json')) {
    console.log(chalk.red('you have exist .eslintrc.json. Please confirm if the file needs to be created'))
    return
  } else {
    fs.writeFileSync(path.join('.eslintrc.json'), eslintrc, { encoding: 'utf-8', mode: 0o766 })
  }
  if (fs.existsSync('.git')) {
    console.log(chalk.red('you have exist .git. Please confirm if the file needs to be created'))
  } else {
    execSync('git init')
    execSync('git config core.hooksPath ./githooks')
  }
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
