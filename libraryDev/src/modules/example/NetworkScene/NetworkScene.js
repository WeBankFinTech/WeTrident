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
import Dialog from '@webank/trident/library/uiComponent/popup/Dialog'
import CGI from './cgi/CGI'

export default class NetworkScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'NetworkScene'
  })

  constructor () {
    super(...arguments)

    APIClient.addHeaders({ testGlobalHeader: 'testGlobalHeader' })
    APIClient.addHeaders({
      '5dc964632f0000760073ec4b': 'only_for_this_api'
    }, undefined, /5dc964632f0000760073ec4b/)
  }

  render () {
    const requestProcessor = [response => {
      console.log(response.data)
      this._showDialog(`请求成功，data: ${JSON.stringify(response.data)}`)
    }, error => {
      console.log(error)
      this._showDialog(`请求失败， errorInfo: ${error.response ? error.response.status : error}`)
    }]

    return (
      <EntryList style={[{
        backgroundColor: Theme.Color.backgroundPrimary
      }, this.props.style]}>
        <PrimaryButton text={`正常POST请求`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.postBookListNormal).then(...requestProcessor))
        }} />
        <PrimaryButton text={`异常POST请求`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.postBookListException).then(...requestProcessor))
        }} />
        <PrimaryButton text={`正常GET请求`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.getBookListNormal).then(...requestProcessor))
        }} />
        <PrimaryButton text={`异常GET请求`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.getBookListException).then(...requestProcessor))
        }} />
        <PrimaryButton text={`全局增加自定义Header`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.requestUseGlobalHeader).then((response) => {
            this._showDialog('请求的Header为' + JSON.stringify(response.config.headers))
          }))
        }} />
        <PrimaryButton text={`特定URL()增加自定义Header`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.requestUseSpecificHeader).then((response) => {
            this._showDialog('请求的Header为' + JSON.stringify(response.config.headers))
          }))
        }} />
        <PrimaryButton text={`Mock使用(随机成功失败)`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.requestUseMock).then(...requestProcessor))
        }} />
        <PrimaryButton text={`缓存设置(API级别)`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.requestUseCache).then((response) => {
            let msg = ''
            if (response.fromCache) {
              msg = '读取缓存成功'
            } else {
              msg = '请求成功'
            }
            this._showDialog(msg + JSON.stringify(response.data))
          }))
        }} />
        <PrimaryButton text={`缓存设置(单次调用级别)`} onPress={() => {
          Loading.wrap(APIClient.request(
            CGI.requestUseCache,
            undefined,
            undefined,
            undefined,
            { cacheMaxAgeInMs: 10 }
          ).then((response) => {
            this._showDialog('请求成功(fromCache: ' + response.fromCache + ')' + JSON.stringify(response.data))
          }))
        }} />
      </EntryList>
    )
  }

  _showDialog (text) {
    const id = Dialog.show({
      texts: [text],
      items: [{
        text: 'Ok!',
        onItemPress: () => Dialog.hide(id)
      }]
    })
  }
}
