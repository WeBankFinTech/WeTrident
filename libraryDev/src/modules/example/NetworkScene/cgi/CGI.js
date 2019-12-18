import { AxiosMocker } from '@webank/trident'

const baseURL = 'http://47.75.152.113:3000/'

export default {
  postBookListNormal: {
    baseURL,
    method: 'post',
    url: '/comments',
    desc: '请求书籍列表',
    request: {}
  },
  postBookListException: {
    baseURL,
    method: 'post',
    url: '/books/error',
    desc: '请求书籍列表错误',
    request: {}
  },
  getBookListNormal: {
    baseURL,
    method: 'get',
    url: '/books',
    desc: '请求书籍列表',
    request: {}
  },
  getBookListException: {
    baseURL,
    method: 'get',
    url: '/books/error',
    desc: '请求书籍列表',
    request: {}
  },
  requestUseGlobalHeader: {
    baseURL,
    method: 'get',
    url: '/books',
    desc: '请求书籍列表',
    request: {}
  },
  requestUseSpecificHeader: {
    baseURL,
    method: 'get',
    url: '/books',
    desc: '请求书籍列表',
    request: {}
  },
  requestUseMock: {
    baseURL,
    method: 'get',
    url: '/books',
    desc: '请求书籍列表',
    request: {},
    mockable: true,
    response: [
      AxiosMocker.success({
        hello: 'world'
      }),
      AxiosMocker.networkError({
        hello: 'world'
      }),
      AxiosMocker.timeout()
    ]
  },
  requestUseCache: {
    cacheMaxAgeInMs: 60000,

    baseURL,
    method: 'get',
    url: '/books',
    desc: '请求书籍列表',
    request: {}
  }
}
