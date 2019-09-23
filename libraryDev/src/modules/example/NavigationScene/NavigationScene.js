/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:37:00.320Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator, WeBaseScene } from '@webank/trident'


export default class NavigationScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'NavigationScene'
  })

  render () {
    return (
      <View>
        <Text>Hello NavigationScene</Text>
      </View>
    )
  }
}
