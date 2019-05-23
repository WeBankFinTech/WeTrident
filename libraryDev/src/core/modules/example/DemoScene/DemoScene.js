/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-04-23T03:47:50.328Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { WeBaseScene } from '@webank/trident'
import { WeTouchable } from '@unpourtous/react-native-touchable'
import { PopupStub } from '@unpourtous/react-native-popup-stub'

import Dialog from '@webank/trident/library/uiComponent/popup/Dialog'
import Toast from '@webank/trident/library/uiComponent/popup/Toast'
import Loading from '@webank/trident/library/uiComponent/popup/Loading'

import PreDefinedAnimation from '@webank/trident/library/uiComponent/popup/PreDefinedAnimation'

export default class DemoScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'DemoScene'
  })

  constructor () {
    super(...arguments)
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
