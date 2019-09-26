/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:36:49.896Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator, WeBaseScene } from '@webank/trident'


export default class NetworkScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'NetworkScene'
  })

  render () {
    return (
      <View>
        <Text>Hello NetworkScene</Text>
      </View>
    )
  }
}
