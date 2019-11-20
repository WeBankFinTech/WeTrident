import AxiosMocker from './AxiosMocker'

// console.log = () => {}
// console.groupCollapsed = () => {}

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
test.only('APIClient addHeaders with match rule', () => {
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

describe('network request', () => {
  test.only('normal request', () => {
    const APIClient = new APIClientCls()
    return APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList',
      desc: '请求书籍列表',
      request: {},
    }).then((response) => {
      expect(response.data).toEqual([{
        'title': '算法导论',
        'author': '[美] Thomas H.Cormen / Charles E.Leiserson / Ronald L.Rivest / Clifford Stein',
        'ISBN': '9787111187776'
      }, {
        'title': '代码大全',
        'author': '[美] 史蒂夫·迈克康奈尔',
        'ISBN': '9787121022982'
      }])
    }, (error) => {
      expect(error).toEqual(null)
    })
  })

  test.only('using path params', () => {
    const APIClient = new APIClientCls()
    return APIClient.request({
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/book/:id',
      desc: '请求书籍列表',
      request: {},
    }, undefined, { id: '9787111187776' }).then((response) => {
      expect(response.data).toEqual({
        'title': '算法导论',
        'author': '[美] Thomas H.Cormen / Charles E.Leiserson / Ronald L.Rivest / Clifford Stein',
        'ISBN': '9787111187776'
      })
    }, (error) => {
      expect(error).toEqual(null)
    })
  })

  test.only('mock request', () => {
    const APIClient = new APIClientCls()
    return APIClient.request({
      mockable: true,
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList',
      desc: '请求书籍列表',
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

  test.only('simple request mock', () => {
    const APIClient = new APIClientCls()
    return APIClient.request({
      mockable: true,
      baseURL: 'http://localhost:4444',
      method: 'get',
      url: '/v1/bookList',
      desc: '请求书籍列表'
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

  test.only('request cache', () => {
    const APIClient = new APIClientCls()

    return new Promise((resolve, reject) => {
      // fist time request, no cache
      APIClient.request({
        baseURL: 'http://localhost:4444',
        method: 'get',
        url: '/v1/bookList2',
        desc: '请求书籍列表',
        request: {}
      }, undefined, undefined, undefined, {
        cacheMaxAgeInMs: 10000
      }).then((response) => {
        expect(response.data).toEqual([{
          'title': '代码大全',
          'author': '[美] 史蒂夫·迈克康奈尔',
          'ISBN': '9787121022982'
        }])

        expect(response.fromCache).toEqual(undefined)
      }).then(() => {
        // the first request is success, cache is available now

        // second time request, may use cache
        APIClient.request({
          baseURL: 'http://localhost:4444',
          method: 'get',
          url: '/v1/bookList2',
          desc: '请求书籍列表',
          request: {}
        }, undefined, undefined, undefined, {
          cacheMaxAgeInMs: 1000000
        }).then((response) => {
          console.log('response.data: ', response.data)
          expect(response.data).toEqual([{
            'title': '代码大全',
            'author': '[美] 史蒂夫·迈克康奈尔',
            'ISBN': '9787121022982'
          }])

          expect(response.fromCache).toEqual(true)
          resolve()
       })

        // second time request, cache is expired is 10ms
        APIClient.request({
          baseURL: 'http://localhost:4444',
          method: 'get',
          url: '/v1/bookList2',
          desc: '请求书籍列表',
          request: {}
        }, undefined, undefined, undefined, {
          cacheMaxAgeInMs: 10
        }).then((response) => {
          expect(response.data).toEqual([{
            'title': '代码大全',
            'author': '[美] 史蒂夫·迈克康奈尔',
            'ISBN': '9787121022982'
          }])
          expect(response.fromCache).toEqual(undefined)
          resolve()
        })
      })
    })
  })
})
