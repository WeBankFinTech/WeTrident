import AxiosMocker from '../../../library/network/AxiosMocker'
const APIClientCls = require('./../../../library/network/APIClient').APIClientCls

let httpServer
beforeEach(() => {
  console.log('Starting the APIClient test server')
  const startServer = require('./APIClient.server')
  httpServer = startServer()
})

afterEach(() => {
  if (httpServer) {
    console.log('Stopping the APIClient test server')
    httpServer.close()
  }
})

test('APIClient test global addHeaders', () => {
  const APIClient = new APIClientCls()

  const postCommonHeader = { testHeader: 'testHeader' }
  APIClient.addHeaders(postCommonHeader, /.*/)
  const mergeHeaders = APIClient._mergeHeaders({
    method: 'post',
    url: '/url1',
    desc: 'request a error url(post)',
    request: {}
  })
  expect(mergeHeaders.testHeader).toBe(postCommonHeader.testHeader)
  expect(Object.keys(mergeHeaders)).toEqual(expect.arrayContaining(['Accept', 'testHeader']))
})

/**
 * 验证是否可以根据不同host的匹配规则针对性的addHeaders
 */
test('APIClient addHeaders with match rule', () => {
  const APIClient = new APIClientCls()

  const postHostAHeader = { testHeaderA: 'testHeader' }
  const postHostBHeader = { testHeaderB: 'testHeader' }
  APIClient.addHeaders(postHostAHeader, undefined, 'not a regexp')
  APIClient.addHeaders(postHostAHeader, undefined, /hosta.com/)
  APIClient.addHeaders(postHostBHeader, undefined, /hostb.com/)
  const mergeHeadersA = APIClient._mergeHeaders({
    method: 'post',
    baseURL: 'https://hosta.com',
    url: '/url1',
    desc: 'request hosta.com(post)',
    request: {}
  })
  const mergeHeadersB = APIClient._mergeHeaders({
    method: 'post',
    baseURL: 'https://hostb.com',
    url: '/url1',
    desc: 'request hostb.com(post)',
    request: {}
  })
  expect(mergeHeadersA.testHeaderA).toBe(postHostAHeader.testHeaderA)
  expect(mergeHeadersB.testHeaderB).toBe(postHostBHeader.testHeaderB)
  expect(Object.keys(mergeHeadersA)).toEqual(['Accept', 'testHeaderA'])
  expect(Object.keys(mergeHeadersB)).toEqual(['Accept', 'testHeaderB'])

  APIClient.addHeaders({ aaaa: 'bbbb' }, 'post', undefined)
  const postMergeHeaders = APIClient._mergeHeaders({
    method: 'post',
    baseURL: 'https://hosta.com',
    url: '/url1',
    desc: 'request hosta.com(post)',
    request: {}
  })
  const getMergeHeaders = APIClient._mergeHeaders({
    method: 'get',
    baseURL: 'https://hosta.com',
    url: '/url1',
    desc: 'request hosta.com(post)',
    request: {}
  })
  expect(Object.keys(postMergeHeaders)).toEqual(['Accept', 'testHeaderA', 'aaaa'])
  expect(Object.keys(getMergeHeaders)).toEqual(['Accept', 'testHeaderA'])
})

test('APIClient setHeaders', () => {
  const APIClient = new APIClientCls()

  const postHostBHeader = { testHeaderBset: 'testHeader' }
  APIClient.setHeaders(postHostBHeader, 'post', /hostb.com/)
  let mergeHeaders = APIClient._mergeHeaders({
    method: 'post',
    baseURL: 'https://hostb.com',
    url: '/url1',
    desc: 'request hostb.com(post)',
    request: {}
  })
  expect(Object.keys(mergeHeaders)).toEqual(['Accept', 'testHeaderBset'])

  mergeHeaders = APIClient._mergeHeaders({
    method: 'get',
    baseURL: 'https://hostb.com',
    url: '/url1',
    desc: 'request hostb.com(post)',
    request: {}
  })
  expect(Object.keys(mergeHeaders)).toEqual(['Accept'])

  APIClient.setHeaders({}, undefined, /hostb.com/)
  mergeHeaders = APIClient._mergeHeaders({
    method: 'get',
    baseURL: 'https://hostb.com',
    url: '/url1',
    desc: 'request hostb.com(post)',
    request: {}
  })
  expect(Object.keys(mergeHeaders)).toEqual([])
  mergeHeaders = APIClient._mergeHeaders({
    method: 'put',
    baseURL: 'https://hostb.com',
    url: '/url1',
    desc: 'request hostb.com(post)',
    request: {}
  })
  expect(Object.keys(mergeHeaders)).toEqual([])
  mergeHeaders = APIClient._mergeHeaders({
    method: 'delete',
    baseURL: 'https://hostb.com',
    url: '/url1',
    desc: 'request hostb.com(post)',
    request: {}
  })
  expect(Object.keys(mergeHeaders)).toEqual([])
})

test('APIClient _checkCGIFormat', () => {
  const APIClient = new APIClientCls()

  expect(APIClient._checkCGIFormat({
    // baseURL: 'https://hosta.com',
    // url: '/url1',
    // desc: '请求消息列表(post)',
  })).toEqual([
    'baseURL should be set for api config',
    'baseURL should be set for api config ',
    'method should be set for api, used as HTTP Verb ',
    'desc should be set for api, used for data report'
  ])
})

describe('network request', () => {
  test('normal request', async () => {
    const APIClient = new APIClientCls()
    await APIClient.request().then(() => {}, (error) => {
      expect(error).toEqual(new Error('invalid api config'))
    })

    await APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList',
      desc: 'request book list',
      request: {}
    }).then((response) => {
      expect(response.data).toEqual([{
        title: '算法导论',
        author: '[美] Thomas H.Cormen / Charles E.Leiserson / Ronald L.Rivest / Clifford Stein',
        ISBN: '9787111187776'
      }, {
        title: '代码大全',
        author: '[美] 史蒂夫·迈克康奈尔',
        ISBN: '9787121022982'
      }])
    }, (error) => {
      expect(error).toEqual(null)
    })

    await APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'post',
      url: '/v1/bookList',
      desc: 'request book list',
      request: {}
    }).then((response) => {
      expect(response.data).toEqual([{
        title: '算法导论',
        author: '[美] Thomas H.Cormen / Charles E.Leiserson / Ronald L.Rivest / Clifford Stein',
        ISBN: '9787111187776'
      }, {
        title: '代码大全',
        author: '[美] 史蒂夫·迈克康奈尔',
        ISBN: '9787121022982'
      }])
    }, (error) => {
      expect(error).toEqual(null)
    })
  })

  test('using path params', async () => {
    const APIClient = new APIClientCls()
    await APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/book/:id',
      desc: 'request book detail',
      request: {}
    }, undefined, { id: '9787111187776' }).then((response) => {
      expect(response.data).toEqual({
        title: '算法导论',
        author: '[美] Thomas H.Cormen / Charles E.Leiserson / Ronald L.Rivest / Clifford Stein',
        ISBN: '9787111187776'
      })
    }, (error) => {
      expect(error).toEqual(null)
    })
  })

  test('mock request', async () => {
    const APIClient = new APIClientCls()
    await APIClient.request({
      mockable: true,
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList',
      desc: 'request book list',
      request: {},
      response: [
        AxiosMocker.success({ data: 'mockdata' })
      ]
    }).then((response) => {
      console.log(response)
      expect(response.data).toEqual({
        data: 'mockdata'
      })
    })
  })

  test('request timeout', async () => {
    const APIClient = new APIClientCls()
    APIClient.setRequestTimeoutInMs(1)
    await APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList',
      desc: 'request book list',
      request: {},
      response: []
    }).then((response) => {
      console.log(response)
      expect(response.data).toEqual({
        data: 'mockdata'
      })
    }, error => {
      expect(error.code).toEqual('ECONNABORTED')
    })

    // restore to 10s
    APIClient.setRequestTimeoutInMs(10000)
    await APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList',
      desc: 'request book list',
      request: {},
      response: []
    }).then((response) => {
      console.log(response)
      expect(response.data).toEqual([
        {
          ISBN: '9787111187776',
          author: '[美] Thomas H.Cormen / Charles E.Leiserson / Ronald L.Rivest / Clifford Stein',
          title: '算法导论'
        },
        {
          ISBN: '9787121022982',
          author: '[美] 史蒂夫·迈克康奈尔',
          title: '代码大全'
        }
      ])
    }, error => {
      expect(error.code).toEqual('ECONNABORTED')
    })
  })

  test('simple request mock', async () => {
    const APIClient = new APIClientCls()
    await APIClient.request({
      mockable: true,
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList',
      desc: 'request book list',
      request: {},
      response: {
        data: 'mockdata'
      }
    }).then((response) => {
      expect(response.data).toEqual({
        data: 'mockdata'
      })

      expect(response.fromMock).toEqual(true)
    })
  })

  test('request cache', async () => {
    const APIClient = new APIClientCls()

    // fist time request, no cache
    await APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList2',
      desc: 'request another book list',
      request: {}
    }, undefined, undefined, undefined, {
      cacheMaxAgeInMs: 10000
    }).then((response) => {
      expect(response.data).toEqual([{
        title: '代码大全',
        author: '[美] 史蒂夫·迈克康奈尔',
        ISBN: '9787121022982'
      }])

      expect(response.fromCache).toEqual(undefined)
    })

    // the first request is success, cache is available now

    // second time request, may use cache
    await APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList2',
      desc: 'request another book list',
      request: {}
    }, undefined, undefined, undefined, {
      cacheMaxAgeInMs: 1000000
    }).then((response) => {
      console.log('response.data: ', response.data)
      expect(response.data).toEqual([{
        title: '代码大全',
        author: '[美] 史蒂夫·迈克康奈尔',
        ISBN: '9787121022982'
      }])

      expect(response.fromCache).toEqual(true)
    })

    // second time request, cache is expired is 10ms
    await APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList2',
      desc: 'request another book list',
      request: {}
    }, undefined, undefined, undefined, {
      cacheMaxAgeInMs: 0
    }).then((response) => {
      expect(response.data).toEqual([{
        title: '代码大全',
        author: '[美] 史蒂夫·迈克康奈尔',
        ISBN: '9787121022982'
      }])
      expect(response.fromCache).toEqual(undefined)
    })

    APIClient.setDefaultCacheMaxAgeInMs(0)
    await APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList2',
      desc: 'request another book list',
      request: {}
    }, undefined, undefined, undefined).then((response) => {
      console.log('response.data: ', response.data)
      expect(response.data).toEqual([{
        title: '代码大全',
        author: '[美] 史蒂夫·迈克康奈尔',
        ISBN: '9787121022982'
      }])

      expect(response.fromCache).toEqual(undefined)
    })

    APIClient.setDefaultCacheMaxAgeInMs(1000000)
    await APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList2',
      desc: 'request another book list',
      request: {}
    }, undefined, undefined, undefined).then((response) => {
      console.log('response.data: ', response.data)
      expect(response.data).toEqual([{
        title: '代码大全',
        author: '[美] 史蒂夫·迈克康奈尔',
        ISBN: '9787121022982'
      }])

      expect(response.fromCache).toEqual(true)
    })
  })
})
