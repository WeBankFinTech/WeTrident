import AxiosMocker from '@webank/trident/library/network/AxiosMocker'
import ServerEnv from '../../../cgi/ServerEnv'
// import {Mocker, Types} from '@unpourtous/mocker'

export default {
  requestTopicPost: {
    method: 'post',
    baseURL: ServerEnv.PREFIX.mockio,
    url: '/v2/5cedf70f300000bd1f6e97fd',
    desc: '请求消息列表(post)',
    request: {},
    response: [
      AxiosMocker.success({}),
      AxiosMocker.networkError(),
      AxiosMocker.timeout(),
    ],
  },
  requestTopicMock: {
    mockable: true,
    baseURL: ServerEnv.PREFIX.mockio,
    url: '/v2/5cedf70f300000bd1f6e97fd',
    desc: '请求消息列表(Mock数据)',
    request: {},
    response: [
      AxiosMocker.success({}),
      AxiosMocker.networkError(),
      AxiosMocker.timeout(),
    ]
  },
  requestTopicCache: {
    method: 'get',
    baseURL: ServerEnv.PREFIX.mockio,
    url: '/v2/5cee2c483000007d3d6e9940',
    desc: '请求消息列表(get支持缓存)',
    request: {},
    response: [AxiosMocker.success({})]
  },

  requestTopicServerError: {
    method: 'post',
    baseURL: ServerEnv.PREFIX.mockio,
    url: '/v2/5cedf90c300000d01e6e9806',
    desc: '请求消息列表(服务器错误)',
    request: {},
    response: []
  },
}