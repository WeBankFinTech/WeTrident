/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-04-23T03:47:50.328Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { WeBaseScene } from '@webank/trident'
import { WeTouchable } from '@unpourtous/react-native-touchable'

import Dialog from '@webank/trident/library/uiComponent/popup/Dialog'
import Toast from '@webank/trident/library/uiComponent/popup/Toast'
import Loading from '@webank/trident/library/uiComponent/popup/Loading'

import APIClient from '@webank/trident/library/network/APIClient'
import CGI from '../cgi/CGI'
import ignoreReject from '@webank/trident/library/utils/ignoreReject'

export default class DemoScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'DemoScene'
  })

  constructor () {
    super(...arguments)
  }

  componentDidMount () {
    ignoreReject(APIClient.request(CGI.requestTopicMock))
    ignoreReject(APIClient.request(CGI.requestTopicMock))
    ignoreReject(APIClient.request(CGI.requestTopicMock))
    ignoreReject(APIClient.request(CGI.requestTopicMock))


    ignoreReject(APIClient.request(CGI.requestTopicServerError))

    ignoreReject(APIClient.request(CGI.requestTopic))
    ignoreReject(APIClient.request(CGI.requestTopic))
    ignoreReject(APIClient.request(CGI.requestTopic))
  }

  onPause (fromScene, toScene) {
    super.onPause(fromScene, toScene)
  }

  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
  }

  render () {
    return (
      <View>

        <WeTouchable onPress={() => {
          Loading.show()
          setTimeout(() => {
            Loading.hide()
          }, 1000)

          const id = Dialog.show({
            texts: ['Hello Trident'],
            items: [
              {
                text: 'Ok!',
                onItemPress: () => {
                  Dialog.hide(id)
                  Toast.show('Canceleddsdfs sfdfs sdf sf sf')

                  Loading.hide()
                }
              },
              {
                text: 'Cancel',
                onItemPress: () => {
                  Dialog.hide(id)
                  Toast.show('Canceleddsdfs sfdfs sdf sf sf cancel')

                  Loading.hide()
                }
              }
            ]
          })
        }}>
          <Text>Hello DemoScene</Text>
          <Text>
            弹窗
          </Text>

        </WeTouchable>
      </View>
    )
  }
}
