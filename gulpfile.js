var gulp = require('gulp'),
  eslint = require('gulp-eslint')
var srcReplace = require('gulp-replace-src')
var rename = require('gulp-rename')
var shell = require('gulp-shell')
var modifyFile = require('gulp-modify-file')
var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('new', 'new controller boilerplate')
    // .command('eslint', 'lint project')
    .example('$0 new -c fund-purchase-result -p /dir/controllers/', 'create FundPurchaseResultController in fund-purchase-result.js and fund-purchase-result.html at /dir/controller/')
    // .example('$0 eslint', 'lint project')
    .describe('c', 'controller')
    .describe('p', 'path')
    .alias('c', 'controller')
    .alias('p', 'path')
    .global('c')
    .nargs('f', 1)
    .help('h')
    .alias('h', 'help')
    .argv

const taskConfig = []
// taskConfig.push({name: 'check:env', task: require('./scripts/gulp/checkEnv')})
// taskConfig.push({name: 'check:network', task: require('./scripts/gulp/checkNetwork')})

// var build = require('./scripts/gulp/build')
// var cleanAndroid = require('./scripts/gulp/cleanAndroid')
//
//
// taskConfig.push({name: 'clean:android', task: cleanAndroid})
// taskConfig.push({name: 'dev:android', task: build.devAndroid, deps: ['check:env']})
// taskConfig.push({name: 'release:android', task: build.releaseAndroid, deps: ['check:env', 'check:network', 'clean:android']})
// taskConfig.push({name: 'build:android', task: build.customBuildAndroid, deps: ['check:env']})
//
// taskConfig.push({name: 'dev:ios', task: build.devIOS, deps: ['check:env']})
// taskConfig.push({name: 'release:ios', task: build.devIOS, deps: ['check:env', 'check:network']})
// taskConfig.push({name: 'build:ios', task: build.customBuildIOS, deps: ['check:env']})
//
// var test = require('./scripts/gulp/test')
// taskConfig.push({name: 'test', task: test.testAll})
// taskConfig.push({name: 'test:coverage', task: test.testAllWithCoverage})
// taskConfig.push({name: 'test:watch', task: test.watchAllTest})

// 代码生成
var generator = require('./scripts/gulp/generator')
taskConfig.push({name: 'gen:module', task: generator.generatorModule})
taskConfig.push({name: 'gen:scene', task: generator.generatorScene})

// taskConfig.push({name: 'docs', task: require('./scripts/gulp/docs')})

for (var i = 0; i < taskConfig.length; i++) {
  gulp.task(taskConfig[i].name, taskConfig[i].deps || [], taskConfig[i].task)
}
const chalk = require('chalk')
gulp.task('usage', () => {
  for (var i = 0; i < taskConfig.length; i++) {
    console.log(chalk.yellow(`${taskConfig[i].name} `) + chalk.green(`${taskConfig[i].task.description} `))
  }
})
