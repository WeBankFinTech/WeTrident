/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:36:42.305Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator, WeBaseScene } from '@webank/trident'


export default class StateManagementScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'StateManagementScene'
  })

  render () {
    return (
      <View>
        <Text>Hello StateManagementScene</Text>
      </View>
    )
  }
}
