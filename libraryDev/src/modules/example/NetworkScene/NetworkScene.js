/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:36:49.896Z.
 */
import React, { Component } from 'react'
import { AppNavigator, WeBaseScene, Theme, Loading, Dialog } from '@webank/trident'
import EntryList from '../../../bizComponents/EntryList'
import APIClient from '@webank/trident/library/network/APIClient'

import CGI from './cgi/CGI'
import { Button } from '@webank/trident/trident-ui'

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
        <Button text={`正常POST请求`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.postBookListNormal).then(...requestProcessor))
        }} />
        <Button text={`异常POST请求`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.postBookListException).then(...requestProcessor))
        }} />
        <Button text={`正常GET请求`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.getBookListNormal).then(...requestProcessor))
        }} />
        <Button text={`异常GET请求`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.getBookListException).then(...requestProcessor))
        }} />
        <Button text={`全局增加自定义Header`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.requestUseGlobalHeader).then((response) => {
            this._showDialog('请求的Header为' + JSON.stringify(response.config.headers))
          }))
        }} />
        <Button text={`特定URL()增加自定义Header`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.requestUseSpecificHeader).then((response) => {
            this._showDialog('请求的Header为' + JSON.stringify(response.config.headers))
          }))
        }} />
        <Button text={`Mock使用(随机成功失败)`} onPress={() => {
          Loading.wrap(APIClient.request(CGI.requestUseMock).then(...requestProcessor))
        }} />
        <Button text={`缓存设置(API级别)`} onPress={() => {
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
        <Button text={`缓存设置(单次调用级别)`} onPress={() => {
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
