import axios from 'axios'
import _ from 'lodash'
import AxiosMocker from './AxiosMocker'
import Cache from './Cache'

/**
 * 1. 处理客户端的请求缓存
 * 2. 支持mock配置
 * @param config
 * @param next
 * @returns {Promise<*>}
 */
const cachedResponse = {
  // $url: {
  //  createAt: '',
  //  response: {},
  // }
}

const qs = require('qs')
const _genUrlWithQuery = (path, params) => {
  return path + '?' + qs.stringify(params)
}
export default class AxiosAdapter {
  defaultCacheTime = 5 * 60000 // 5分钟
  constructor () {
    this.cache = new Cache()
    this.adapter = this.adapter.bind(this)
  }

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
      } else if (_.isObject(mockResponse)) {
        return Promise.resolve(AxiosMocker.success(mockResponse)(config))
      }
    }

    if (config.method === 'get') {
      const cacheKey = _genUrlWithQuery(config.url)

      const cacheData = this.cache.read(cacheKey, _.get(config, 'options.cacheMaxAgeInMs', this.defaultCacheTime))
      if (cacheData) {
        // console.log('getCache: ', cacheKey, cacheData.createAt)
        // TODO 各种请求时间需要更新
        return Promise.resolve(cacheData.response)
      }
    }

    // return axios.defaults.adapter(config)
    // TODO 最后直接走default的adapter
    return new Promise((resolve, reject) => {
      axios.defaults.adapter(config).then((response) => {
        this.setCacheResponse(config.url, config.params, response)
        resolve(response)
      }, reject)
    })
  }

  setCacheResponse (url, params, response) {
    const cacheKey = _genUrlWithQuery(url, params)
    this.cache.write(cacheKey, {
      createAt: new Date().getTime(),
      response: {
        ...response,
        fromCache: true
      }
    })
  }

}
