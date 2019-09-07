/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-04-23T03:47:50.328Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { WeBaseScene, AppNavigator } from '@webank/trident'
import { WeTouchable } from '@unpourtous/react-native-touchable'


import APIClient from '@webank/trident/library/network/APIClient'
import CGI from '../cgi/CGI'
import ignoreReject from '@webank/trident/library/utils/ignoreReject'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'
import EntryList from '../../../bizComponents/EntryList'

export default class DemoScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'Trident Demo',
  })

  constructor () {
    super(...arguments)
  }

  componentDidMount () {
    // ignoreReject(APIClient.request(CGI.requestTopicMock))
    // ignoreReject(APIClient.request(CGI.requestTopicMock))
    // ignoreReject(APIClient.request(CGI.requestTopicMock))
    // APIClient.addHeaders(
    //   {
    //     mockyHeaders: 'hahahah mocky header'
    //   },
    //   undefined,
    //   /.*mocky.*/
    // )
    // ignoreReject(APIClient.request(CGI.requestTopicCache))
    // ignoreReject(APIClient.request(CGI.requestTopicTestServer))

    // ignoreReject(APIClient.request(CGI.requestTopicServerError))
    //
    // ignoreReject(APIClient.request(CGI.requestTopic))
    // ignoreReject(APIClient.request(CGI.requestTopic))
    // ignoreReject(APIClient.request(CGI.requestTopic))
  }

  onPause (fromScene, toScene) {
    super.onPause(fromScene, toScene)
  }

  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
  }

  render () {
    return (
      <EntryList>
        <PrimaryButton text={'Trident-Framework'} onPress={() => {
          AppNavigator.example.FrameworkScene()
        }} />

        <PrimaryButton text={'Trident-UI'} onPress={() => {
          AppNavigator.ui.UIScene()
        }} />
      </EntryList>
    )
  }
}
