'use strict'

import Interceptor from './Interceptor'

/**
 * 基础的网络类，与业务无关的
 */
const defaultNetworkTimeout = 30000
const HttpRetCode = {
  CLIENT_NETWORK_TIMEOUT: -700003
}
export {
  HttpRetCode
}
export default class Http {
  constructor () {
    this.defaults = {
      headers: {
        common: {
          'Accept': 'application/json'
        },
        get: {
          'Content-Type': 'application/json'
        },
        post: {
          'Content-Type': 'application/json'
        },
        put: {
          'Content-Type': 'application/json'
        }
      },
      interceptors: []
    }
    this._intercept.bind(this)
  }

  get (url, params, headers) {
    return this.request(url, 'GET', params, headers)
  }

  post (url, body, headers) {
    return this.request(url, 'POST', body, headers)
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

  setCommonHeaders (commonHeaders) {
    this.defaults.headers.common = commonHeaders
  }

  addCommonHeaders (customHeaders) {
    this.defaults.headers.common = {
      ...this.defaults.headers.common,
      ...customHeaders
    }
  }

  setGetHeaders (getHeaders) {
    this.defaults.headers.get = getHeaders
  }

  addGetHeaders (customHeaders) {
    this.defaults.headers.get = {
      ...this.defaults.headers.get,
      ...customHeaders
    }
  }

  extendGetHeaders (params) {
    if (this.defaults.headers.get && this.defaults.headers.get.params) {
      this.defaults.headers.get.params = JSON.stringify({
        ...JSON.parse(this.defaults.headers.get.params),
        ...params
      })
    }
  }
  hasCSRFTokenHeader () {
    if (this.defaults.headers.post && this.defaults.headers.post.params) {
      return this.defaults.headers.post.params.csrf_token
    }
    return false
  }
  setPostHeaders (postHeaders) {
    this.defaults.headers.post = postHeaders
  }

  addPostHeaders (customHeaders) {
    this.defaults.headers.post = {
      ...this.defaults.headers.post,
      ...customHeaders
    }
  }

  extendPostHeaders (params) {
    if (this.defaults.headers.post && this.defaults.headers.post.params) {
      this.defaults.headers.post.params = JSON.stringify({
        ...JSON.parse(this.defaults.headers.post.params),
        ...params
      })
    }
  }

  setPutHeaders (putHeaders) {
    this.defaults.headers.put = putHeaders
  }

  addPutHeaders (customHeaders) {
    this.defaults.headers.put = {
      ...this.defaults.headers.put,
      ...customHeaders
    }
  }

  addInterceptor (interceptor) {
    if (interceptor && interceptor instanceof Interceptor) {
      this.defaults.interceptors.push(interceptor)
    }
  }

  request (url = '', method = '', body = {}, customHeaders = {}, netWorkTimeout = defaultNetworkTimeout) {
    // TODO check params

    let headers = {}
    let request = null
    if (method.toUpperCase() === 'GET') {
      let searchParams = ''
      Object.keys(body).forEach((key) => {
        searchParams += key + '=' + encodeURIComponent(body[key]) + '&'
      })
      url = (searchParams && searchParams.length > 0) ? (url + '?' + searchParams) : url
      headers = Object.assign(headers, this.defaults.headers.common, this.defaults.headers.get, customHeaders)
      request = new Request(url, {
        method: method.toUpperCase(),
        headers: headers
      })
    } else if (method.toUpperCase() === 'POST') {
      headers = Object.assign(headers, this.defaults.headers.common, this.defaults.headers.post, customHeaders)
      request = new Request(url, {
        method: method.toUpperCase(),
        body: this._getBodyByHeader(body, headers),
        headers: headers
      })
    } else if (method.toUpperCase() === 'PUT') {
      headers = Object.assign(headers, this.defaults.headers.common, this.defaults.headers.put, customHeaders)
      throw new Error('NOT implemented HTTP method: ' + method)
    } else if (method.toUpperCase() === 'DELETE') {
      // TODO
      throw new Error('NOT implemented HTTP method: ' + method)
    } else {
      throw new Error('Invalid HTTP method: ' + method)
    }

    request.cache = false // no cache first

    function statusCheck (response) {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response.json())
      } else {
        return Promise.reject(response)
      }
    }

    const timeout = (ms, promise) => {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          reject({
            ret_code: HttpRetCode.CLIENT_NETWORK_TIMEOUT,
            ret_msg: `Network timeout(${netWorkTimeout}ms)`
          })
        }, ms)
        promise.then(resolve, reject)
      })
    }

    const fetchWithTimeout = (request) => {
      return timeout(netWorkTimeout, fetch(request))
    }

    return this._intercept(request, null, null).then((result) => {
      // 判断是否是远程调试, chrome上timeout会立即返回导致错误
      const fetchMethod = window.navigator && window.navigator.userAgent !== undefined ? fetch : fetchWithTimeout
      return fetchMethod(request).then(statusCheck, error => {
        return Promise.reject(error)
      })
    }, (error) => {
      return Promise.reject(error)
    })
  }

  /**
   * process body by headers['Content-Type'] and body type
   * @param body
   * @param headers
   * @private
   */
  _getBodyByHeader (body, headers) {
    if (body instanceof FormData && headers['Content-Type'] === 'multipart/form-data') {
      return body
    }
    if (headers['Content-Type'] === 'application/json') {
      return JSON.stringify(body)
    }
  }

  /**
   *
   * @param request 请求对象
   * @param response 返回对象
   * @return response 返回错误
   */
  _intercept (request, response, error) {
    if (request) {
      var p = Promise.resolve()
      for (let i = 0; i < this.defaults.interceptors.length; i++) {
        let inter = this.defaults.interceptors[i]
        p = p.then(() => inter.requestInterceptor(request))
      }
      return p
    } else if (response) {
      // TODO
      // return response;
      return Promise.resolve()
    } else if (error) {
      // TODO
      return Promise.resolve()
    } else {
      // TODO
      // throw new Error('invalid parameter for _intercept');
      return Promise.resolve()
    }
  }
}
