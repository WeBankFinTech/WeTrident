// 指定脚本的执行程序

// 引入依赖
var program = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

// 定义版本号以及命令选项
program
.version('1.0.0')
.option('-i --init [name]', 'init a project', 'myFirstProject')

program.parse(process.argv);

if(program.init) {
  // 获取将要构建的项目根目录
  var projectPath = path.resolve(program.init);
  // 获取将要构建的的项目名称
  var projectName = path.basename(projectPath);

  console.log(`Start to init a project in ${chalk.green(projectPath)}`);

  // 根据将要构建的项目名称创建文件夹
  fs.ensureDirSync(projectName);

  // 获取本地模块下的demo1目录
  var cwd = path.join(__dirname, '../templates/demo1');

  // 从demo1目录中读取除node_modules目录下的所有文件并筛选处理
//  vfs.src(['**/*', '!node_modules/**/*'], {cwd: cwd, dot: true})
//  pipe(through.obj(function(file, enc, callback){
//    if(!file.stat.isFile()) {
//      return callback();
//    }
//
//    this.push(file);
//    return callback();
//  }))
//  // 将从demo1目录下读取的文件流写入到之前创建的文件夹中
//  .pipe(vfs.dest(projectPath))
//  .on('end', function() {
//    console.log('Installing packages...')
//
//    // 将node工作目录更改成构建的项目根目录下
//    process.chdir(projectPath);
//
//    // 执行安装命令
//    require('../lib/install');
//  })
//  .resume();
}
