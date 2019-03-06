/**
 * 定义所有后台接口, 结构如下
 * {
 *   path: '' // 请求路径,
 *   cgiPrefix: '', // 后台系统，例如行内系统，OP系统，CDN等
 *   desc: '' // 接口功能描述, 后续用于数据分析,
 *   request: {}, // 请求数据结构
 *   response: {}, // 响应的数据结构（对应网络接口返回数据中的 ret_data 字段）
 * }
 * Created by {{author}} on {{createTime}}.
 */
import { CGI as globalCGI } from 'apps/webankPro/api'
// import {Types} from '@unpourtous/mocker'

// const METHOD = {
//   GET: 'GET',
//   POST: 'POST'
// }

const CGI = {
  ...globalCGI
}

const keyMirror = require('fbjs/lib/keyMirror')
CGI.keys = keyMirror(CGI)

export {CGI}
