import AxiosMocker from '@webank/trident/library/network/AxiosMocker'

function mockable (b) {

}

export default {
  postBookListNormal: {
    baseURL: 'https://www.mocky.io/',
    method: 'post',
    url: '/v2/5dc964632f0000760073ec4b',
    desc: '请求书籍列表',
    request: {},
  },
  postBookListException: {
    baseURL: 'https://www.mocky.io/',
    method: 'post',
    url: '/v2/error',
    desc: '请求书籍列表',
    request: {},
  },
  getBookListNormal: {
    baseURL: 'https://www.mocky.io/',
    method: 'get',
    url: '/v2/5dc964632f0000760073ec4b',
    desc: '请求书籍列表',
    request: {},
  },
  getBookListException: {
    baseURL: 'https://www.mocky.io/',
    method: 'get',
    url: '/v2/error',
    desc: '请求书籍列表',
    request: {},
  },
  requestUseGlobalHeader: {
    baseURL: 'https://www.mocky.io/',
    method: 'post',
    url: '/v2/5dc96cf72f0000560073ecb9',
    desc: '请求书籍列表',
    request: {},
  },
  requestUseSpecificHeader: {
    baseURL: 'https://www.mocky.io/',
    method: 'post',
    url: '/v2/5dc964632f0000760073ec4b',
    desc: '请求书籍列表',
    request: {},
  },
  requestUseMock: {
    baseURL: 'https://www.mocky.io/',
    method: 'get',
    url: '/v2/5dc964632f0000760073ec4b',
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

    baseURL: 'https://www.mocky.io/',
    method: 'get',
    url: '/v2/5dc964632f0000760073ec4b',
    desc: '请求书籍列表',
    request: {
    },
  }
}
