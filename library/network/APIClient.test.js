test('APIClient 测试全局 AddHeaders', () => {
  const APIClient = require('./APIClient').default

  const postCommonHeader = { testHeader: 'testHeader' }
  APIClient.addHeaders(postCommonHeader, /.*/)
  const mergeHeaders = APIClient._mergeHeaders({
    method: 'post',
    url: '/url1',
    desc: '请求消息列表(post)',
    request: {}
  })
  expect(mergeHeaders['testHeader']).toBe(postCommonHeader['testHeader'])
  expect(Object.keys(mergeHeaders)).toEqual(expect.arrayContaining(['Accept', 'testHeader', 'Content-Type']))
})

/**
 * 验证是否可以根据不同host的匹配规则针对性的addHeaders
 */
test('APIClient 按匹配规则 AddHeaders', () => {
  const APIClient = require('./APIClient').default

  const postHostAHeader = { testHeaderA: 'testHeader' }
  const postHostBHeader = { testHeaderB: 'testHeader' }
  APIClient.addHeaders(postHostAHeader, /hosta.com/)
  APIClient.addHeaders(postHostBHeader, /hostb.com/)
  const mergeHeadersA = APIClient._mergeHeaders({
    method: 'post',
    baseURL: 'hosta.com',
    url: '/url1',
    desc: '请求消息列表(post)',
    request: {}
  })
  const mergeHeadersB = APIClient._mergeHeaders({
    method: 'post',
    baseURL: 'hostb.com',
    url: '/url1',
    desc: '请求消息列表(post)',
    request: {}
  })
  expect(mergeHeadersA['testHeaderA']).toBe(postHostAHeader['testHeaderA'])
  expect(mergeHeadersA['testHeaderB']).toBe(postHostBHeader['testHeaderB'])
  expect(Object.keys(mergeHeadersA)).toEqual(expect.arrayContaining(['Accept', 'testHeaderA', 'Content-Type']))
  expect(Object.keys(mergeHeadersB)).toEqual(expect.arrayContaining(['Accept', 'testHeaderB', 'Content-Type']))
})

