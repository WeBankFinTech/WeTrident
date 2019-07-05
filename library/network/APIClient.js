import axios from 'axios'
import wrapLogInterceptor from './wrapLogInterceptor'
import AxiosAdapter from './AxiosAdapter'

/**
 * 1. 封装axios
 * 2. 支持缓存
 * 3. 支持mock
 * 4. 支持配置化的接口
 */
class APIClient {
  constructor () {
    this.instance = axios.create({
      timeout: 5000,
      // headers: {'X-Custom-Header': 'foobar'}
    })

    wrapLogInterceptor(this.instance, {
      consoleRequestKeys: ['method', 'url', 'params', 'data', 'requestHeader'],
      consoleResponseKeys: ['method', 'url', 'params', 'responseData'],
    })
  }

  request (apiConfig, body) {
    if (!apiConfig) {
      return Promise.reject('invalid cgi config')
    }
    // this._checkCGIFormat(apiConfig)

    const payload = {}
    if (apiConfig.method === 'get') {
      payload.params = body
    } else if (['put', 'post', 'patch'].includes(apiConfig.method)) {
      payload.data = body
    }

    const axiosConfig = {
      ...apiConfig,
      ...payload,
      adapter: new AxiosAdapter().adapter
    }
    return this.instance.request(axiosConfig)
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
}

export default new APIClient()
