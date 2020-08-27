export default class AxiosMocker {
  /**
   * 添加config以后原样返回
   * @param response
   * @returns {function(*): {config: *}}
   */
  static replay (response = {}) {
    return (config) => {
      const mockResponse = response || {}
      return {
        ...mockResponse,
        config,
        fromMock: true
      }
    }
  }

  /**
   * 指定data的成功返回
   * @param data
   * @returns {function(*): (*|never)}
   */
  static success (data) {
    return (config) => {
      return Promise.resolve({
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: config.request,
        data,
        fromMock: true
      })
    }
  }

  /**
   * TODO 模拟网络错误
   * @returns {function(*): Promise<never>}
   */
  static networkError () {
    return (config) => {
      var error = new Error('Network Error')
      error.config = config
      error.fromMock = true
      return Promise.reject(error)
    }
  }

  /**
   * TODO 模拟超时错误
   * @returns {function(*): Promise<never>}
   */
  static timeout () {
    return (config) => {
      var error = new Error('timeout of ' + config.timeout + 'ms exceeded')
      error.config = config
      error.code = 'ECONNABORTED'
      error.fromMock = true
      return Promise.reject(error)
    }
  }
}
