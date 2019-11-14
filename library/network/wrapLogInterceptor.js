import _ from 'lodash'
// 打印请求，返回
// 记录请求耗时
// 成功失败
const defaultConsoleRequestKeys = ['method', 'url', 'params', 'data', 'requestHeader', 'rawRequest']

const defaultConsoleResponseKeys = ['method', 'url', 'params', 'responseData', 'requestHeader', 'responseHeader', 'rawResponse']
const defaultConsoleResponseErrorKeys = ['method', 'url', 'params', 'responseData', 'requestHeader', 'responseHeader', 'rawResponse']
export default (axiosInstance, option) => {
  let requestAutoIncId = 0
  if (!axiosInstance) {
    console.warn('axios instance should not be empty')
    return
  }

  axiosInstance.interceptors.request.use(function (config) {
    config._reqId = requestAutoIncId++
    config._startTime = new Date().getTime()

    // 解决console中的对象被改变以后，已经console出来的内容也被改变的情况
    const configForOutput = _.cloneDeep(config)
    const output = {
      method: configForOutput.method,
      url: `${configForOutput.method} ${combineURLs(configForOutput.baseURL, configForOutput.url)}`,
      params: configForOutput.params,
      data: configForOutput.data,
      requestHeader: configForOutput.headers,
      rawRequest: configForOutput
    }

    const outputKeys = option.consoleRequestKeys || defaultConsoleRequestKeys
    consoleGroup(`%c🌐[${config.desc}](${config._reqId}) Request`, '#00A', outputKeys, output)
    return config
  }, function (error) {
    consoleGroup(`%c🌐[${config.desc}](${config._reqId}) Request Error`, '#00A', ['error'], { error })
    return Promise.reject(error)
  })

  axiosInstance.interceptors.response.use(function (response) {
    const config = response.config || {}

    // 记录请求耗时
    const output = {
      method: config.method,
      url: `${combineURLs(config.baseURL, config.url)}`,
      params: response.config.params,
      responseData: response.data,
      requestHeader: response.config.headers,
      responseHeader: response.headers,
      rawResponse: response
    }

    const outputKeys = option.consoleResponseKeys || defaultConsoleResponseKeys

    let responseTypeDesc = ''
    let titleColor = 'green'
    if (response.fromMock === true) {
      responseTypeDesc = '>>> MOCK DATA WARNING <<< '
      titleColor = '#AA0'
    } else if (response.fromCache === true) {
      responseTypeDesc = '>>> CACHE WARNING <<< '
      titleColor = '#AA0'
    }
    consoleGroup(
      `%c🌐[${config.desc}](${config._reqId}) ${responseTypeDesc}Response: StatusCode: ${response.status}; Time: ${(new Date().getTime() - config._startTime)}ms;`,
      titleColor,
      outputKeys,
      output
    )
    return response
  }, function (error) {
    const response = error.response || {}
    const config = error.config || {}

    const output = {
      method: config.method,
      url: `${combineURLs(config.baseURL, config.url)}`,
      params: config.params,
      responseData: response.data,
      requestHeader: config.headers,
      responseHeader: response.headers,
      rawResponse: response
    }

    const outputKeys = option.consoleResponseErrorKeys || defaultConsoleResponseErrorKeys
    consoleGroup(
      `%c🌐[${config.desc}](${config._reqId}) Response Failed: errorCode: ${error.code}; Time: ${(new Date().getTime() - config._startTime)}ms;`,
      '#F00',
      outputKeys,
      output
    )

    // TODO 增加一个外部通知的回调 或者直接增加 CURL
    return Promise.reject(error)
  })
}

function combineURLs (baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}

function consoleGroup (title, titleColor, outputKeys, output) {
  console.groupCollapsed(title, 'color:' + titleColor)
  outputKeys.forEach(item => {
    if (output[item]) {
      console.log(item + ':', output[item])
    }
  })
  console.groupEnd()
}
