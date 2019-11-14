import axios from 'axios'
import wrapLogInterceptor from './wrapLogInterceptor'
import AxiosAdapter from './AxiosAdapter'

/**
 * 1. 封装axios
 * 2. 支持缓存
 * 3. 支持mock
 * 4. 支持配置化的接口
 * 5. 支持根据域名规则配置不同的header
 */
const validHTTPMethod = ['put', 'post', 'patch', 'delete']

class APIClient {
  defaults = {}
  _timeout = 5 * 60 * 1000

  constructor () {
    this.defaults = {
      headers: {
        common: [{
          headers: { Accept: 'application/json' },
          match: /.*/
        }],
        get: [],
        post: [],
        put: [],
        delete: []
      }
    }

    this._init()
  }

  _init () {
    this.instance = axios.create({
      timeout: this._timeout
    })

    wrapLogInterceptor(this.instance, {
      consoleRequestKeys: ['method', 'url', 'params', 'data', 'requestHeader'],
      consoleResponseKeys: ['method', 'url', 'params', 'responseData']
    })
  }

  /**
   * 设置请求超时时间
   * @param timeout
   */
  setRequestTimeoutInMs (timeout) {
    this._timeout = timeout
    this._init()
  }

  /**
   * 添加通用header
   * @param headers 通用header的内容
   * @param method 是否只在指定的method下携带此header， 默认所有method携带
   * @param match 匹配条件，只有路径匹配来此规则才会携带这些header，默认全匹配
   */
  setHeaders (headers, method, match = /.*/) {
    if (validHTTPMethod.includes(method)) {
      this.defaults.headers[method] = [{ match, headers }]
    } else {
      this.defaults.headers.common = [{ match, headers }]
    }
  }

  addHeaders (headers, method, match = /.*/) {
    if (validHTTPMethod.includes(method)) {
      this.defaults.headers[method] = [
        ...this.defaults.headers[method],
        { headers, match }
      ]
    } else {
      this.defaults.headers.common = [
        ...this.defaults.headers.common,
        { headers, match }
      ]
    }
  }

  /**
   *
   * @param apiConfig
   * @param body
   * @param pathParams
   * @param headers
   * @returns {Promise<never>|*}
   */
  request (apiConfig, body, pathParams = {}, headers = {}) {
    if (!apiConfig) {
      return Promise.reject('invalid cgi config')
    }
    // this._checkCGIFormat(apiConfig)

    const payload = {}
    if (apiConfig.method === 'get') {
      payload.params = body
    } else if (['put', 'post', 'patch', 'delete'].includes(apiConfig.method)) {
      payload.data = body
    }

    const Route = require('route-parser')
    apiConfig.path = new Route(apiConfig.url).reverse(pathParams)

    const axiosConfig = {
      ...apiConfig,
      ...payload,
      headers: this._mergeHeaders(apiConfig, headers),
      adapter: new AxiosAdapter().adapter
    }
    return this.instance.request(axiosConfig)
  }

  /**
   * 合并三个地方的header, match条件满足才添加
   * @param apiConfig
   * @param apiHeaders
   * @private
   */
  _mergeHeaders (apiConfig, apiHeaders = {}) {
    const httpMethod = apiConfig.method || 'get'
    const commonHeaders = [...this.defaults.headers.common, ...this.defaults.headers[httpMethod]]

    const fullURL = this._combineFullURL(apiConfig)
    const matchedHeader = commonHeaders
      .filter(item => {
        if (Object.prototype.toString.call(item.match) === '[object RegExp]') {
          return item.match.test(fullURL)
        } else {
          return undefined
        }
      })
      .map(item => item.headers)
      .reduce((previousValue = {}, currentValue = {}) => ({ ...previousValue, ...currentValue }))
    const cgiConfigHeaders = apiConfig.headers || {}
    console.log('mergeHeaders', {
      ...matchedHeader,
      ...cgiConfigHeaders,
      ...apiHeaders
    })

    return {
      ...matchedHeader,
      ...cgiConfigHeaders,
      ...apiHeaders
    }
  }

  /**
   * 组装URL
   * @param apiConfig
   * @returns {*}
   * @private
   */
  _combineFullURL (apiConfig) {
    return apiConfig.baseURL + apiConfig.url
  }

  /**
   * 检查CGI格式是否合法
   * @param cgi
   * @private
   */
  _checkCGIFormat (cgi) {
    const descArray = []

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
    return descArray
  }
}

export default new APIClient()

const APIClientCls = APIClient
export {
  APIClientCls
}
