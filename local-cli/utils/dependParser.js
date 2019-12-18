'use strict'

const path = require('path')
const fs = require('fs')
const Walker = require('iwalk')
const _ = require('lodash')

const importReg = /from["']([^\.\/][^"']*?)["']/g

// 系统模块，take from http://nodejs.org/api/index.json
var sysList = [
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'crypto',
  'debugger',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'https',
  'net',
  'os',
  'path',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'tls',
  'tty',
  'dgram',
  'url',
  'util',
  'vm',
  'zlib'
]

// 默认的黑名单
var defaultBlackList = [
  'node_modules/*',
  'test/*',
  'doc/*',
  'assets/*'
]

var DependParser = function (source) {
  this.depends = {}
  // 带有系统模块的依赖列表
  this.requireList = []
  // 最终的依赖列表
  this.dependList = []
  this.config = {
    blackList: []
  }
  this.source = source
}

DependParser.prototype.load = function (callback) {
  var self = this
  var packagePath = path.join(self.source, 'package.json')
  if (!fs.existsSync(packagePath)) {
    var error = new Error('Not a project root, package.json not found!')
    return callback(error)
  }

  var blackList = defaultBlackList.concat(this.config.blackList)

  // 加上前缀
  blackList.map(function (v, i) {
    return (self.source + '/' + v).replace(/\/\//g, '/')
  })

  var blackListReg = new RegExp(blackList.join('|').replace(/\./g, '\\.').replace(/\*/g, '.*'))

  var walker = new Walker()
  walker.walk(this.source, function (filename, isDirectory) {
    if (!isDirectory) {
      var ext = path.extname(filename)
      if ((ext === '.js' || ext === '') && !blackListReg.test(filename)) {
        self.parseFile(filename)
      }
    }
  })

  walker.on('end', function (totalFile, totalFolder) {
    // 去重
    self.dependList = _.uniq(self.requireList)
    // 过滤掉系统模块
      .filter(function (i) {
        return sysList.indexOf(i) === -1
      })

    callback(null, self.dependList || [])
  })
}

// 解析文件
DependParser.prototype.parseFile = function (file) {
  // 过滤空格，去掉单行和多行注释
  var text = fs.readFileSync(file, 'utf8')
    .replace(/\s/g, '')
    .replace(/\/\/.*?\n/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')

  var match
  while ((match = importReg.exec(text))) {
    this.requireList.push(match[1])
  }
}

/**
 * 分析依赖并返回结果
 * Examples:
 * ```
 *  var dp = require("dependparser");
 *  dp.process(process.cwd().replace(/test$/,""), {
 *    blackList:[
 *      "test.js"
 *    ],
 *    showError:true
 *  }, function (err, result) {
 *    if (!error) {
 *      console.log(result)
 *    } else {
 *      console.log(error)
 *    }
 *  });
 * ```
 * @param {string} source 要分析的项目路径，最后跟上斜线。
 * @param {object} config 配置参数，目前支持blackList（黑名单数组），showError(请求错误是否在控制台显示错误信息）
 * @param {function} callback 回调方法，第一个参数如果出错则是一个Error实例，其第二个参数是最后获取的依赖的对象。
 */
exports.process = function (source, config, callback) {
  if (!callback) {
    callback = config
    config = {}
  }

  var dp = new DependParser(source)
  Object.assign(dp.config, config)
  dp.load(callback)
}
