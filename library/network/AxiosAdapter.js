import axios from 'axios'
import _ from 'lodash'

/**
 * 1. 处理客户端的请求缓存
 * 2. 支持mock配置
 * @param config
 * @param next
 * @returns {Promise<*>}
 */
const defaultCacheTime = 5 * 60000 // 5分钟
const cachedResponse = {
  // $url: {
  //  createAt: '',
  //  response: {},
  // }
}
export default class AxiosAdapter {
  // constructor () {
  //   this.cache = new Cache()
  // }
  adapter (config) {
    // TODO 先判读Mock
    if (config.mockable === true) {
      const mockResponse = config.response
      if (_.isArray(mockResponse) && mockResponse.length > 0) {
        // 随机返回其中之一, 支持模拟失败
        const randomIndex = Math.floor(mockResponse.length * Math.random())
        const randomMockFunc = mockResponse[randomIndex]
        const response = randomMockFunc(config)
        return Promise.resolve(response)
      }
    }

    // TODO 再判读缓存, 只有get处理缓存
    // if (config.method === 'get') {
    //   const cacheKey = this._genUrlWithQuery(config.url)
    //
    //   const cacheData = this.cache.read(cacheKey)
    //   if (cacheData) {
    //     return Promise.resolve(cacheData)
    //   }
    // }
    //
    // try {
    //   await axios.defaults.adapter(config)
    // } catch (e) {
    //   console.log(e)
    // }

    // TODO 最后直接走default的adapter
    return axios.defaults.adapter(config)
  }

  setCacheResponse (url, params, response) {
    const cacheKey = this._genUrlWithQuery(url, params, '')
    this.cachedResponse[cacheKey] = {
      createAt: new Date().getTime(),
      response
    }
  }

  _genUrlWithQuery (path, params, cgiPrefix) {
    let url = path + '?'
    params = params || {}
    Object.keys(params).sort().forEach((key) => {
      /* TODO 如果value是个对象（Array 或者 Object）序列化一下，但是这里要注意两个问题：
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
}

