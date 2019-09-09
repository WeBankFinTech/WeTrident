/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-09T12:52:38.196Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator, WeBaseScene } from '@webank/trident'


export default class PluginStoreScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'PluginStoreScene'
  })

  render () {
    return (
      <View>
        <Text>Hello PluginStoreScene</Text>
      </View>
    )
  }
}
