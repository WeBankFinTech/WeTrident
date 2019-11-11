/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:36:49.896Z.
 */
import React, { Component } from 'react'
import { AppNavigator, WeBaseScene } from '@webank/trident'
import { Theme } from '@webank/trident/trident-ui/theme'
import EntryList from '../../../bizComponents/EntryList'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'
import APIClient from '@webank/trident/library/network/APIClient'

import Loading from '@webank/trident/trident-ui/popup/Loading'
import Toast from '@webank/trident/trident-ui/popup/Toast'
import AxiosMocker from '@webank/trident/library/network/AxiosMocker'

export default class NetworkScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'NetworkScene'
  })

  // 这里演示几种网络的情况
  // 正常Post请求
  // 正常get请求
  // 错误的post请求
  // 错误的get请求
  // 错误的get请求
  // 自定义header通用
  // 自定义header特定URL

  // Mock的使用
  // 缓存的设置使用CGI配置超时时间
  // 缓存的设置接口传递超时时间
  render () {
    const requestProcessor = [response => {
      console.log(response.data)
      Toast.show(`请求成功，data: ${JSON.stringify(response.data)}`)
    }, error => {
      console.log(error)
      Toast.show(`请求失败， errorInfo: ${error.response ? error.response.status : error}`)
    }]

    APIClient.addHeaders({testGlobalHeader: 'testGlobalHeader'})
    APIClient.addHeaders({'5dc964632f0000760073ec4b': 'only_for_5dc964632f0000760073ec4b'}, undefined, /5dc964632f0000760073ec4b/)
    return (
      <EntryList style={[{
        backgroundColor: Theme.Color.backgroundPrimary
      }, this.props.style]}>
        <PrimaryButton text={`正常POST请求`} onPress={() => {
          Loading.wrap(APIClient.request({
            baseURL: 'https://www.mocky.io/',
            method: 'post',
            url: '/v2/5dc964632f0000760073ec4b',
            desc: '请求书籍列表',
            request: {},
          }).then(...requestProcessor))
        }} />
        <PrimaryButton text={`异常POST请求`} onPress={() => {
          Loading.wrap(APIClient.request({
            baseURL: 'https://www.mocky.io/',
            method: 'post',
            url: '/v2/error',
            desc: '请求书籍列表',
            request: {},
          }).then(...requestProcessor))
        }} />
        <PrimaryButton text={`正常GET请求`} onPress={() => {
          Loading.wrap(APIClient.request({
            baseURL: 'https://www.mocky.io/',
            method: 'get',
            url: '/v2/5dc964632f0000760073ec4b',
            desc: '请求书籍列表',
            request: {},
          }).then(...requestProcessor))
        }} />
        <PrimaryButton text={`异常GET请求`} onPress={() => {
          Loading.wrap(APIClient.request({
            baseURL: 'https://www.mocky.io/',
            method: 'get',
            url: '/v2/error',
            desc: '请求书籍列表',
            request: {},
          }).then(...requestProcessor))
        }} />
        <PrimaryButton text={`全局增加自定义Header`} onPress={() => {
          Loading.wrap(APIClient.request({
            baseURL: 'https://www.mocky.io/',
            method: 'post',
            url: '/v2/5dc96cf72f0000560073ecb9',
            desc: '请求书籍列表',
            request: {},
          }).then((response) => {
            Toast.show('请求的Header为' + JSON.stringify(response.config.headers))
          }))
        }} />
        <PrimaryButton text={`特定URL()增加自定义Header`} onPress={() => {
          Loading.wrap(APIClient.request({
            baseURL: 'https://www.mocky.io/',
            method: 'post',
            url: '/v2/5dc964632f0000760073ec4b',
            desc: '请求书籍列表',
            request: {},
          }).then((response) => {
            Toast.show('请求的Header为' + JSON.stringify(response.config.headers))
          }))
        }} />

        <PrimaryButton text={`Mock使用`} onPress={() => {
          Loading.wrap(APIClient.request({
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
          }).then(...requestProcessor))
        }} />
        <PrimaryButton text={`缓存设置(API级别)`} onPress={() => {}} />
        <PrimaryButton text={`缓存设置(单次调用级别)`} onPress={() => { }} />
      </EntryList>
    )
  }
}
