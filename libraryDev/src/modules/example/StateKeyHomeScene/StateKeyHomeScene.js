/**
 * 负责用户交互逻辑
 *
 * Created by lhtin on 2019-12-13T11:19:01.084Z.
 */
import React from 'react'
import { View } from 'react-native'
import { AppNavigator, Button, WeBaseScene } from '@webank/trident'

export default class StateKeyHomeScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'StateKeyHomeScene'
  })

  render () {
    return (
      <View>
        <Button
          text='WeTrident' style={{ marginTop: 10 }} onPress={() => {
            AppNavigator.example.StateKeyScene({ id: 'prod-1' })
          }}
        />

        <Button
          text='React' style={{ marginTop: 10 }} onPress={() => {
            AppNavigator.example.StateKeyScene({ id: 'prod-2' })
          }}
        />
      </View>
    )
  }
}
