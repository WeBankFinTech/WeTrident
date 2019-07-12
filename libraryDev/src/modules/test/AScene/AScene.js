/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-05-21T11:40:33.638Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator, WeBaseScene } from '@webank/trident'


export default class AScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'AScene'
  })

  render () {
    return (
      <View>
        <Text>Hello AScene</Text>
      </View>
    )
  }
}
