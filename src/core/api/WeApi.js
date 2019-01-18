/**
 * 微众后台服务相关的基础的网络类
 */
import { DeviceEventEmitter } from 'react-native'
import Http, {HttpRetCode} from '../../../network/core/Http'
import CookieInterceptor from '../../../network/core/CookieInterceptor.js'
import {CGIReturnCode, StatConst} from '../constants'

import ServerEnv from './ServerEnv'
import ServerPrefixType from './ServerPrefixType'
import {Mocker} from '@unpourtous/mocker'
import Statistics from '../../../plugins/Statistics'
import AccountService from 'apps/webankPro/services/AccountService'
import WebankTokenHelper from 'apps/webankPro/serviceHelper/WebankTokenHelper'
import { NativeCons } from 'apps/webankPro/constants'
import _ from 'lodash'
import RidPath from 'apps/webankPro/services/RidPath'
import TimeDataService from 'apps/webankPro/services/TimeDataService'

const md5 = require('md5')

export const RET_CODE = {
  UNKNOW_ERROR: -800000,
  HTTP_ERROR: -800001,
  TOKEN_EXPIRED: -800002
}

const STATUS = {
  SUCCESS_MOCK: 'MOCK_SUCCESS',
  SUCCESS_CACHE: 'SUCCESS_CACHE',
  REUSE_PROMISE: 'REUSE_PROMISE',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL'
}

const getRequestUID = (() => {
  let at = 0
  return () => {
    at += 1
    return at
  }
})()

let instance = null

if (!console.groupCollapsed) {
  console.groupCollapsed = () => {}
}
if (!console.groupEnd) {
  console.groupEnd = () => {}
}
class WeApi {
  constructor () {
    if (!instance) {
      this.httpClient = new Http()
      this.httpClient.addInterceptor(new CookieInterceptor({
        onCookieChanged: (webankToken) => {
          this.extendCommonHeaders({requestToken: webankToken})
        }
      }))
      // this.httpClient.addInteceptor(new LogInterceptor());
      this.defaultCacheTime = 5 * 60000 // 5分钟
      this.cachedResponse = {
        // $url: {
        //  createAt: '',
        //  response: {},
        // }
      }
      this.cachedPromise = {
        // $url: {
        //  createAt: '',
        //  promise: Promise
        // }
      }
      this.userInfo = {}
      this.tokenExpiredListener = []
      this.debuginfo = {}
      this.requestCacheQueue = []
      this.appPauseTime = 0

      // 监听刷新登录态
      DeviceEventEmitter.addListener(NativeCons.GLOBAL_EVENT.ON_APP_PAUSE, (param) => this._onAppPause(param))
      DeviceEventEmitter.addListener(NativeCons.GLOBAL_EVENT.ON_APP_RESUME, (param) => this._onAppResume(param))

      instance = this
    }

    return instance
  }

  /**
   * @return {WeApi}
   */
  static getInstance () {
    return new WeApi()
  }

  setDebugInfo (debugInfo) {
    this.debugInfo = {
      ...this.debugInfo,
      ...debugInfo
    }
  }

  initCommonHeader (securityDeviceInfo) {
    this.httpClient.addPostHeaders({
      'params': JSON.stringify({
        body_url_encoded: '0', // 客户端对body没有encode
        client_type: 'APP_PRO',
        ...securityDeviceInfo
      })
    })
    this.httpClient.addGetHeaders({
      'params': JSON.stringify({
        client_type: 'APP_PRO',
        ...securityDeviceInfo})
    })
  }

  extendCommonHeaders (params) {
    this.httpClient.extendPostHeaders(params)
    this.httpClient.extendGetHeaders(params)
  }

  hasCSRFTokenHeader () {
    return this.httpClient.hasCSRFTokenHeader()
  }

  setCacheResponse (url, params, response) {
    const cacheKey = this._genUrlWithQuery(url, params, '')
    this.cachedResponse[cacheKey] = {
      createAt: new Date().getTime(),
      response
    }
  }
  setCachePromise (url, params, promise, uid) {
    const cacheKey = this._genUrlWithQuery(url, params, '')
    this.cachedPromise[cacheKey] = {
      createAt: new Date().getTime(),
      promise,
      uid
    }
  }
  // 先判断
  parseReuseType (url, params, cacheMaxAgeInMs, reuseRequestTime) {
    const cacheKey = this._genUrlWithQuery(url, params, '')
    if (!isNaN(cacheMaxAgeInMs) &&
      this.cachedResponse[cacheKey] &&
      new Date().getTime() - this.cachedResponse[cacheKey].createAt < cacheMaxAgeInMs &&
      this.cachedResponse[cacheKey].response
    ) {
      return 'reuseResponse'
    } else if (!isNaN(reuseRequestTime) &&
      this.cachedPromise[cacheKey] &&
      new Date().getTime() - this.cachedPromise[cacheKey].createAt < reuseRequestTime &&
      this.cachedPromise[cacheKey].promise
    ) {
      return 'reusePromise'
    }
  }
  resetCache () {
    this.cachedResponse = {}
    this.requestCacheQueue = []
    this.cachedPromise = {}
  }

  _onAppPause (param) {
    this.appPauseTime = param.pauseTime
  }

  _onAppResume (param) {
    this.appPauseTime = 0
    this._sendCacheRequest()
  }

  _sendCacheRequest () {
    if (this.requestCacheQueue && this.requestCacheQueue.length > 0) {
      this._refreshRequestToken().then(() => {
        this.requestCacheQueue.forEach(item => {
          setTimeout(() => {
            this._sendRequest(item.resolve, item.reject, item.cgi, item.fullUrl, item.body, item.headers, item.bizParams)
          }, 100)
        })
        this.requestCacheQueue = []
      })
    }
  }

  async _refreshRequestToken () {
    if (this.requestCacheQueue && this.requestCacheQueue.length > 0) {
      let requestContent = this.requestCacheQueue.find(item => item.fullUrl.indexOf('personal.webank.com') >= 0 || item.fullUrl.indexOf('personal.test.webank.com') >= 0)
      if (requestContent && requestContent.fullUrl) {
        try {
          let token = await CookieInterceptor.getToken(requestContent.fullUrl)
          // this.extendCommonHeaders({requestToken: token})
          Statistics.reportEvent('cacheRequestUpdateToken', {requestToken: md5(md5(token || ''))})
        } catch (error) {
          console.warn('refresh request token error')
          Statistics.reportEvent('cacheRequestUpdateToken', {requestToken: 'refreshRequestTokenFail'})
        }
      }
    }
    return Promise.resolve()
  }

  // 统一处理返回码
  _processRawResponseAndCache (cgi, responseData, url, bizParams, ingoreRetCode) {
    // CDN返回没有ret_code和ret_data的结构
    if (ingoreRetCode || url.startsWith(ServerEnv.getWebankBaseUrl(ServerPrefixType.CDN))) {
      if (cgi.method.toUpperCase() === 'GET') {
        this.setCacheResponse(url, bizParams, responseData)
        // 清空promise
        this.setCachePromise(url, bizParams, null, null)
      }

      return Promise.resolve(responseData)
    }
    if (responseData.ret_code !== CGIReturnCode.CGI_SUCCESS &&
      responseData.ret_code !== CGIReturnCode.CGI_SUCCESS_2 &&
      responseData.ret_code !== CGIReturnCode.CGI_SUCCESS_OP &&
      responseData.ret_code !== CGIReturnCode.CGI_SUCCESS_Q_CLOUD_FB &&
      responseData.ret_code !== CGIReturnCode.CGI_PROCESSING &&
      responseData.ret_code !== CGIReturnCode.CGI_COMBINED_BUY &&
      responseData.ret_code !== CGIReturnCode.CGI_SUCCESS_3 &&
      responseData.ret_code !== CGIReturnCode.CGI_SUCCESS_4 &&
      responseData.ret_code !== CGIReturnCode.CGI_SUCCESS_5 &&
      responseData.ret_code !== CGIReturnCode.CGI_SUCCESS_HJHTR) {
      return Promise.reject(responseData)
    } else {
      if (cgi.method.toUpperCase() === 'GET') {
        this.setCacheResponse(url, bizParams, responseData)
        // 清空promise
        this.setCachePromise(url, bizParams, null, null)
      }
      return Promise.resolve(responseData)
    }
  }

  /**
   * 如果是服务器错误，不能重试
   * @param error
   * @return {boolean}
   */
  isServerError (error) {
    if (error && error.status && parseInt(error.status / 500) === 1) {
      return true
    }
  }

  isTokenExpired (error) {
    if (error && error.status === 401) {
      return true
    }

    if (error && [
      CGIReturnCode.CGI_WEBANK_TOKEN_EXPIRED,
      CGIReturnCode.CGI_WEBANK_TOKEN_EXPIRED_2,
      CGIReturnCode.CGI_WEBANK_TOKEN_EXPIRED_3,
      CGIReturnCode.CGI_WEBANK_TOKEN_EXPIRED_4,
      CGIReturnCode.CGI_WEBANK_TOKEN_EXPIRED_5,
      RET_CODE.TOKEN_EXPIRED
    ].indexOf(error.ret_code) !== -1) {
      return true
    }
    return false
  }

  /**
   * 登录态过期时是否忽略此cgi
   * @param cgiName
   * @returns {boolean}
   */
  isCGITokenExpiredIgnored (cgiName) {
    return (cgiName === 'msg_center/getusermsgstatus' ||
      cgiName === 'data/report_v2' ||
      cgiName === 'msg_center/getmsglist' ||
      cgiName === 'msg_center/gettypemsg' ||
      cgiName === 'redpacket/queryredpackets' ||
      cgiName === 'productinfo/getproductlistbycode' ||
      cgiName === 'history/query/earnings' ||
      cgiName === 'productinfo/getproductinfo' ||
      cgiName === 'user/querylimit_base' ||
      cgiName === 'redpacket/queryallredpackets' ||
      cgiName === 'finance/query/timeline' ||
      cgiName === 'productinfo/getfinancepageviewinfo' ||
      cgiName === 'redpacket/queryusestatus' ||
      cgiName === 'red_dot/has_viewed' ||
      cgiName === 'gold/query_current_price'
    )
  }

  _normalizeError (error, url, cgi = {}) {
    if (this.isTokenExpired(error)) {
      // 有错误码, 说明返回的是response
      if (!this.isCGITokenExpiredIgnored(cgi.path)) {
        this.tokenExpiredListener.forEach((listener) => {
          listener()
          Statistics.reportEvent('tokenExpired', {path: cgi.path, exchangeTokenFlag: this.getExchangeWebankTokenFlag()})
        })

        // 上报登录态丢失，两分钟内不重复上报
        if (!this.lastReportLoginStateTime || (new Date().getTime() - this.lastReportLoginStateTime) >= 2 * 60 * 1000) {
          this.lastReportLoginStateTime = new Date().getTime()
          Statistics.reportEvent('LossLoginState', {path: cgi.path})
        }
      }

      return {
        ret_code: RET_CODE.TOKEN_EXPIRED,
        ret_msg: '登录态过期, 请重新登录后再试',
        response: error
      }
    } else if (error && error.status) {
      return {
        ret_code: RET_CODE.HTTP_ERROR,
        ret_msg: `请求失败, status(${error.status})`,
        error: error
      }
    } else {
      if (error && error.ret_code) {
        if (error.ret_code === HttpRetCode.CLIENT_NETWORK_TIMEOUT) {
          return {
            ret_code: HttpRetCode.CLIENT_NETWORK_TIMEOUT,
            ret_msg: '请求超时(client)'
          }
        }
        return error
      } else if (error && error.ret_code) {
        return {
          ret_code: RET_CODE.UNKNOW_ERROR,
          ret_msg: '网络错误，请稍后重试',
          error
        }
      } else {
        return {
          ret_code: RET_CODE.UNKNOW_ERROR,
          ret_msg: '网络错误，请稍后重试',
          error
        }
      }
    }
  }

  _genFullUrl (cgi, cgiPrefix) {
    if (!cgiPrefix) {
      console.warn('cgiPrefix should not be empty')
    }
    return ServerEnv.getWebankBaseUrl(cgiPrefix) + cgi
  }

  _genUrlWithQuery (cgi, params, cgiPrefix) {
    let url
    if (cgiPrefix) {
      url = ServerEnv.getWebankBaseUrl(cgiPrefix) + cgi
    } else {
      url = cgi
    }
    url += '?'
    params = params || {}
    Object.keys(params).sort().forEach((key) => {
      /* 如果value是个对象（Array 或者 Object）序列化一下，但是这里要注意两个问题：
       1, 内部keys是否需要有排序需求。
       2, get请求串长度是有限制的，调用者请自己注意 -- feshionxu 20170713
       */
      if (typeof params[key] === 'object') {
        url += (key + '=' + encodeURIComponent(JSON.stringify(params[key])) + '&')
      } else {
        url += (key + '=' + encodeURIComponent(params[key]) + '&')
      }
    })
    return url
  }

  setUserInfo (useInfo) {
    // set from initprops is string
    if (typeof useInfo === 'string') {
      try {
        useInfo = JSON.parse(useInfo)
      } catch (e) {
        console.log('setUserInfo and parse error:', e)
      }
    }
    this.userInfo = useInfo || {}
  }

  getUserInfo () {
    return this.userInfo
  }

  addTokenExpiredListener (listener) {
    if (listener && (typeof listener === 'function')) {
      this.tokenExpiredListener.push(listener)
    }
  }

  setCgiParams (cgiParams) {
    this._cgiParams = cgiParams
  }

  setH5Ver (ver) {
    if (this._cgiParams) {
      this._cgiParams.h5_ver = ver
    }
  }

  // RN App 版本号
  getH5Ver () {
    if (this._cgiParams) {
      return this._cgiParams.h5_ver
    }
  }

  getCgiParams (cgiParams) {
    return this._cgiParams || {}
  }

  setRDCNWhiteList (whiteList) {
    if (whiteList) {
      this._RDCNWhiteList = whiteList
    }
  }

  getRDCNWhiteList () {
    return this._RDCNWhiteList
  }

  setExchangeWebankTokenFlag (flag) {
    this.exchangeWebankTokenFlag = flag
  }

  getExchangeWebankTokenFlag () {
    return this.exchangeWebankTokenFlag
  }

  _checkCGIFormat (cgi) {
    let descArray = []

    if (!cgi.method) {
      descArray.push('method should be set for cgi, used as HTTP Verb ')
    }
    if (!cgi.desc) {
      descArray.push('desc should be set for cgi, used for data report')
    }
    if (!cgi.request) {
      descArray.push('request should be set for cgi, used for document')
    }
    if (!cgi.response) {
      descArray.push('response should be set for cgi, used for document')
    }
    if (descArray.length > 0) {
      console.warn(descArray, cgi)
    }
  }

  /**
   * 是否
   * @param cgi
   * @return {boolean|*|LoDashExplicitWrapper<boolean>}
   * @private
   */
  _allowCgiRequest (cgi) {
    // 接口在白名单列表中且处于未开户状态 禁止请求
    if (!AccountService.hasAccount() && this._RDCNWhiteList) {
      let inWhiteList = this._RDCNWhiteList.some(item => {
        if (item && item.cgi && item.cgi.match(cgi.path)) {
          return true
        }
      })

      return !inWhiteList
    }

    return true
  }

  /**
   *
   * @param cgi cgi配置
   * @param params get的参数或者post的body
   * @param headers header信息
   * @param option 请求配置, 例如缓存的配置
   * @param query post的请求需要额外带上去的query信息
   * @returns {*}
   */
  request (cgi, params = {}, headers = {}, option = {}, query = {}) {
    this._checkCGIFormat(cgi)

    const method = cgi.method || ''
    if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].indexOf(method.toUpperCase()) === -1) {
      console.warn(`cgi ${cgi.path}'s method is not a valid http verb`)
      return
    }
    if (method.toUpperCase() === 'GET') {
      return this.get(cgi, params, headers, option, query)
    } else if (method.toUpperCase() === 'POST') {
      return this.post(cgi, params, headers, option, query)
    } else {
      console.warn(method + ' is not supported yet! waiting for your code')
    }
  }
  /**
   * 发起 GET 请求
   * @param {Object} cgi CGI配置
   * @param {Object} [body={}] 请求参数
   * @param {Object} [headers={}] 自定义headers
   * @param {Object} [option={}] 选项
   *        options.cacheMaxAgeInMs 最大缓存时间(ms)
   *        options.netWorkTimeout 接口超时时间(ms)
   *        options.reuseRequestTime 复用请求的时间(ms)
   * @param {Object} [query={}] 直接带在url里面的参数, 这个跟params分开放，是因为webank的后台接收的params要放在json里面
   *        options.cacheMaxAgeInMs 最大缓存时间(ms)
   * @returns {Promise}
   */
  get (cgi, body = {}, headers = {}, option = {}, query = {}) {
    if (cgi.method && cgi.method.toUpperCase() !== 'GET') {
      console.warn(`${cgi.path}的method配置可能有误，或者调用的方法用错`)
    }
    cgi.method = 'GET'
    let cgiPrefix = ServerPrefixType.WEBANK
    let path = ''
    if (typeof cgi === 'object' && cgi.path) {
      if (cgi.cgiPrefix) {
        cgiPrefix = cgi.cgiPrefix
      }
      path = cgi.path
    } else {
      console.log('建议在get请求第一个参数直接传出object，不要传出xxx.path, ' + path)
    }

    headers = headers || {}
    body = body || {}
    // webank的后台协议里面，get参数被包成json放到了一个param字段，所以这里不能把query直接合并到url
    let fullUrl = this._genFullUrl(path, cgiPrefix)

    let uid = getRequestUID()
    this._logRequest(cgi, fullUrl, body, headers, option, query, uid)

    // mock
    if (cgi.mockable === true && cgi.response) {
      const mockResponse = Mocker.mock(cgi.response)
      let response
      if (cgi.staticFile) {
        response = mockResponse
      } else {
        response = {
          ret_code: CGIReturnCode.CGI_SUCCESS,
          ret_data: mockResponse
        }
      }
      this._logResponse(cgi, fullUrl, body, headers, STATUS.SUCCESS_MOCK, response, undefined, uid)
      return Promise.resolve(response)
    }
    let cacheKey = this._genUrlWithQuery(path, body, cgiPrefix)
    let cacheMaxAgeInMs = this.defaultCacheTime
    let netWorkTimeout
    let reuseRequestTime
    if (cgi && !isNaN(cgi.cacheMaxAgeInMs)) {
      cacheMaxAgeInMs = cgi.cacheMaxAgeInMs
    }
    if (option && !isNaN(option.cacheMaxAgeInMs)) {
      cacheMaxAgeInMs = option.cacheMaxAgeInMs
    }
    if (cgi && !isNaN(cgi.reuseRequestTime)) {
      reuseRequestTime = cgi.reuseRequestTime
    }
    if (option && !isNaN(option.reuseRequestTime)) {
      reuseRequestTime = option.reuseRequestTime
    }

    if (cgi && !isNaN(cgi.netWorkTimeout)) {
      netWorkTimeout = cgi.netWorkTimeout
    }
    if (option && !isNaN(option.netWorkTimeout)) {
      netWorkTimeout = option.netWorkTimeout
    }
    // 判断是否需要复用 请求/结果
    if (this.parseReuseType(fullUrl, body, cacheMaxAgeInMs, reuseRequestTime) === 'reuseResponse') {
      // 打印日志
      this._logResponse(cgi, fullUrl, body, headers, STATUS.SUCCESS_CACHE, this.cachedResponse[cacheKey].response, undefined, uid)
      // 上报复用
      Statistics.reportEvent('RequestReuse', {type: 'response', path: cgi.path})
      // 返回promise
      return Promise.resolve(this.cachedResponse[cacheKey].response)
    } else if (this.parseReuseType(fullUrl, body, cacheMaxAgeInMs, reuseRequestTime) === 'reusePromise') {
      this._logResponse(cgi, fullUrl, body, headers, STATUS.REUSE_PROMISE, undefined, undefined, this.cachedPromise[cacheKey].uid)
      Statistics.reportEvent('RequestReuse', {type: 'promise', path: cgi.path})
      return this.cachedPromise[cacheKey].promise
    }
    const webankCgiParam = this.getCgiParams()

    let promise = new Promise((resolve, reject) => {
      this._sendRequest(resolve, reject, cgi, fullUrl, {...webankCgiParam, ...query, param: JSON.stringify(body)}, headers, body, netWorkTimeout, uid)
    })
    this.setCachePromise(fullUrl, body, promise, uid)
    return promise
  }

  post (cgi, body, headers, option = {}, query) {
    if (cgi.method && cgi.method.toUpperCase() !== 'POST') {
      console.warn(`${cgi.path}的method配置可能有误，或者调用的方法用错`)
    }

    let ridList = RidPath.getRidList()
    this.httpClient.extendPostHeaders({
      action_tags: ridList
    })

    cgi.method = 'POST'
    let cgiPrefix = ServerPrefixType.WEBANK
    let path = ''
    if (typeof cgi === 'object' && cgi.path) {
      if (cgi.cgiPrefix) {
        cgiPrefix = cgi.cgiPrefix
      }
      path = cgi.path
    } else {
      console.log('建议在get请求第一个参数直接传出object，不要传出xxx.path, ' + path)
    }
    let fullUrl = this._genFullUrl(path, cgiPrefix)
    let uid = getRequestUID()
    this._logRequest(cgi, fullUrl, body, headers, option, query, uid)

    const webankCgiParam = this.getCgiParams()
    fullUrl += '?'
    const allQuery = {...webankCgiParam, ...query}
    for (let key in allQuery) {
      if (key && allQuery[key] !== undefined) {
        let value = allQuery[key]
        fullUrl += (key + '=' + encodeURIComponent(value) + '&')
      }
    }
    let netWorkTimeout
    if (option && !isNaN(option.netWorkTimeout)) {
      netWorkTimeout = option.netWorkTimeout
    }
    return new Promise((resolve, reject) => {
      this._sendRequest(resolve, reject, cgi, fullUrl, body, headers, null, netWorkTimeout, uid)
    })
  }

  _sendRequest (resolve, reject, cgi, fullUrl, body, headers, bizParams, netWorkTimeout, uid) {
    if (!this._allowCgiRequest(cgi)) {
      console.log('退出不请求')
      return
    }

    if (
      this.getExchangeWebankTokenFlag() ||
      (this.appPauseTime > 0 && WebankTokenHelper.needRefreshToken(new Date().getTime(), this.appPauseTime))
    ) {
      this.requestCacheQueue.push({
        resolve: resolve,
        reject: reject,
        cgi: cgi,
        fullUrl: fullUrl,
        body: body,
        headers: headers,
        bizParams: bizParams
      })
      return
    }

    this._doSendRequest(cgi, fullUrl, body, headers, bizParams, netWorkTimeout, uid).then(
      result => resolve(result), error => reject(error)
    )
  }

  _doSendRequest (cgi, fullUrl, body, headers, bizParams, netWorkTimeout, uid) {
    cgi.method = cgi.method || 'GET'
    const statObj = {}
    statObj.cgiName = cgi.path
    statObj.timeConsuming = new Date().getTime()
    statObj.startTime = new Date().getTime()
    statObj.cgiParams = body

    const startTime = new Date().getTime()
    // 没有设置 method 的默认为get
    return this.httpClient.request(fullUrl, cgi.method, body, headers, netWorkTimeout).then((response) => {
      return this._processRawResponseAndCache.bind(this)(cgi, response, fullUrl, bizParams, cgi.staticFile).then(response => {
        this._logResponse(cgi, fullUrl, body, headers, STATUS.SUCCESS, response, startTime, uid)
        statObj.timeConsuming = new Date().getTime() - statObj.timeConsuming
        statObj.endTime = new Date().getTime()
        statObj.retCode = response.ret_code
        statObj.status = 0
        statObj.resultType = StatConst.SUCCESS_RESULT_TYPE

        TimeDataService.updateTimeByRetTime(response.ret_time)

        Statistics.reportInterface(statObj)
        return response
      }, error => {
        this._logResponse(cgi, fullUrl, body, headers, STATUS.FAIL, error, startTime, uid)

        statObj.timeConsuming = new Date().getTime() - statObj.timeConsuming
        statObj.endTime = new Date().getTime()
        statObj.retCode = response.ret_code
        statObj.status = -2
        statObj.resultType = StatConst.LOGIC_FAILURE_RESULT_TYPE

        TimeDataService.updateTimeByRetTime(response.ret_time)

        Statistics.reportInterface(statObj)
        return Promise.reject(this._normalizeError.bind(this)(error, fullUrl, cgi))
      })
    }, error => {
      this._logResponse(cgi, fullUrl, body, headers, STATUS.FAIL, error, startTime, uid)

      statObj.timeConsuming = new Date().getTime() - statObj.timeConsuming
      statObj.endTime = new Date().getTime()
      statObj.retCode = (error && error.status) ? error.status : ''
      statObj.resultType = StatConst.FAILURE_RESULT_TYPE

      Statistics.reportInterface(statObj)
      return Promise.reject(this._normalizeError.bind(this)(error, fullUrl, cgi))
    })
  }
  head () {
    // TODO
  }

  put () {
    // TODO
  }

  delete () {
    // TODO
  }

  async prefetch (cgi, params = {}, headers = {}, option = {cacheMaxAgeInMs: 0}) {
    if (cgi === null || typeof cgi !== 'object' || typeof cgi.path !== 'string') {
      throw new Error(`${JSON.stringify(cgi)} is not a CGI object`)
    }

    const apiName = cgi.path
    try {
      const res = await this.get(cgi, params, headers, option)
      console.log(`%c>>> PREFETCH <<< ${apiName} success, params: %O, headers: %O, response: %O`, 'color:#0A0', params, headers, res)
      return res
    } catch (error) {
      console.log(`%c>>> PREFETCH <<< ${apiName} failed, params: %O, headers: %O, error: %O`, 'color:#AA0', params, headers, error)
      return error
    }
  }

  getHttpClient () {
    return this.httpClient
  }

  // color define
  // request #00A
  // response success: #0A0
  // response fail: #AAO
  // response mocked: #F0F
  // response cached: #0AA

  _logRequest (cgi = {}, fullUrl, paramsOrBody, customHeaders, option, query, uid) {
    const cgiDesc = (cgi && cgi.desc) ? `[${cgi.desc}]` + cgi.path : cgi.path
    const method = (cgi && cgi.method) ? cgi.method.toUpperCase() : ''
    let headers
    if (method === 'GET') {
      headers = Object.assign({}, this.httpClient.defaults.headers.common, this.httpClient.defaults.headers.get, customHeaders || {})
    } else if (method === 'POST') {
      headers = Object.assign({}, this.httpClient.defaults.headers.common, this.httpClient.defaults.headers.post, customHeaders || {})
    }
    console.groupCollapsed(`%cR${uid}-${cgiDesc}:${method} Request`, 'color:#00A')
    console.log('fullUrl', fullUrl)
    console.log('paramsOrBody', paramsOrBody)
    console.log('header', headers)
    console.log('option', option)
    console.log('query', query)
    console.groupEnd()
  }

  _logResponse (cgi = {}, fullUrl, paramsOrBody, header, status, responseOrError, startTime, uid) {
    const _responseOrError = _.cloneDeep(responseOrError)
    const cgiDesc = (cgi && cgi.desc) ? `[${cgi.desc}]` + cgi.path : cgi.path
    const method = (cgi && cgi.method) ? cgi.method.toUpperCase() : ''
    if (status === STATUS.SUCCESS) {
      console.groupCollapsed(`%cR${uid}-${cgiDesc}:${method} Response ${(new Date().getTime() - startTime)}ms`, 'color:green')
      console.log('fullUrl', fullUrl)
      console.log('paramsOrBody', paramsOrBody)
      console.log('header', header)
      console.log('response', _responseOrError)
      console.groupEnd()
    } else if (status === STATUS.FAIL) {
      console.log(`%cR${uid}-${cgiDesc}:${method} Response Failed:paramsOrBody %O :Headers %O :Error %O`, 'color:#AA0', paramsOrBody, header, responseOrError)
      console.log(`%c${cgiDesc} 失败了, 麻烦后台同学看一下, \nURL: %s \ncdnNo: %s \necif: %s \n请求内容: %s \n\n返回错误: %s \n谢谢`, 'color:#AA0',
        fullUrl,
        this.debugInfo && this.debugInfo.dcnNo || '',
        this.debugInfo && this.debugInfo.ecifNo || '',
        JSON.stringify(paramsOrBody),
        JSON.stringify(_responseOrError)
      )
    } else if (status === STATUS.SUCCESS_MOCK) {
      console.groupCollapsed(`%c>>> MOCK DATA WARNING <<< R${uid}-${cgiDesc}:${method} Response Failed`, 'color:#AA0')
      console.log('fullUrl', fullUrl)
      console.log('paramsOrBody', paramsOrBody)
      console.log('header', header)
      console.log('responseOrError', _responseOrError)
      console.groupEnd()
    } else if (status === STATUS.SUCCESS_CACHE) {
      console.groupCollapsed(`%c>>> CACHE WARNING <<< R${uid}-${cgiDesc}:${method} Response`, 'color:#AA0')
      console.log('fullUrl', fullUrl)
      console.log('paramsOrBody', paramsOrBody)
      console.log('header', header)
      console.log('responseOrError', _responseOrError)
      console.groupEnd()
    } else if (status === STATUS.REUSE_PROMISE) {
      console.groupCollapsed(`%c>>> REUSE PROMISE WARNING <<< 复用-R${uid}-${cgiDesc}:${method} Promise`, 'color:#008B8B')
      console.log('fullUrl', fullUrl)
      console.log('paramsOrBody', paramsOrBody)
      console.log('header', header)
      console.log('responseOrError', _responseOrError)
      console.groupEnd()
    }
  }
}
export default WeApi.getInstance()
