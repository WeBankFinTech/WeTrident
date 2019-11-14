const APIClientCls = require('./APIClient').APIClientCls
test.only('APIClient 测试全局 AddHeaders', () => {
  const APIClient = new APIClientCls()

  const postCommonHeader = { testHeader: 'testHeader' }
  APIClient.addHeaders(postCommonHeader, /.*/)
  const mergeHeaders = APIClient._mergeHeaders({
    method: 'post',
    url: '/url1',
    desc: '请求消息列表(post)',
    request: {}
  })
  expect(mergeHeaders['testHeader']).toBe(postCommonHeader['testHeader'])
  expect(Object.keys(mergeHeaders)).toEqual(expect.arrayContaining(['Accept', 'testHeader']))
})

/**
 * 验证是否可以根据不同host的匹配规则针对性的addHeaders
 */
test.only('APIClient 按匹配规则 AddHeaders', () => {
  const APIClient = new APIClientCls()

  const postHostAHeader = { testHeaderA: 'testHeader' }
  const postHostBHeader = { testHeaderB: 'testHeader' }
  APIClient.addHeaders(postHostAHeader, undefined, /hosta.com/)
  APIClient.addHeaders(postHostBHeader, undefined, /hostb.com/)
  const mergeHeadersA = APIClient._mergeHeaders({
    method: 'post',
    baseURL: 'https://hosta.com',
    url: '/url1',
    desc: '请求消息列表(post)',
    request: {}
  })
  const mergeHeadersB = APIClient._mergeHeaders({
    method: 'post',
    baseURL: 'https://hostb.com',
    url: '/url1',
    desc: '请求消息列表(post)',
    request: {}
  })
  expect(mergeHeadersA['testHeaderA']).toBe(postHostAHeader['testHeaderA'])
  expect(mergeHeadersB['testHeaderB']).toBe(postHostBHeader['testHeaderB'])
  expect(Object.keys(mergeHeadersA)).toEqual(['Accept', 'testHeaderA'])
  expect(Object.keys(mergeHeadersB)).toEqual(['Accept', 'testHeaderB'])
})

