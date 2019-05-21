var gulp = require('gulp')
const taskConfig = []

// 代码生成
var generator = require('./scripts/gulp/generator')
taskConfig.push({ name: 'gen:module', task: generator.generatorModule })
taskConfig.push({ name: 'gen:scene', task: generator.generatorScene })

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
