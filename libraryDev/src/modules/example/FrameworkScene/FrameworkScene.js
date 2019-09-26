/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:22:47.495Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { AppNavigator, WeBaseScene } from '@webank/trident'
import PrimaryButton from '@webank/trident/library/uiComponent/PrimaryButton'


export default class FrameworkScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'FrameworkScene'
  })

  render () {
    return (
      <View style={{
        height: 180,
        justifyContent: 'space-around',
        paddingHorizontal: 20
      }}>
        <PrimaryButton text={'Navigation'} onPress={() => {
          AppNavigator.example.NavigationScene()
        }} />

        <PrimaryButton text={'Network'} onPress={() => {
          AppNavigator.example.NetworkScene()
        }} />

        <PrimaryButton text={'State Management'} onPress={() => {
          AppNavigator.example.StateManagementScene()
        }} />
      </View>
    )
  }
}
