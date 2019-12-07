/**
 * 负责用户交互逻辑
 *
 * Created by erichua on 2019-09-07T07:22:47.495Z.
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import {AppNavigator, WeBaseScene, Button, ActionSheet, Toast} from '@webank/trident'

export default class FrameworkScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    headerTitle: params.title || 'FrameworkScene'
  })

  render () {
    return (
      <View style={{
        justifyContent: 'space-around',
        paddingHorizontal: 20
      }}>
        <Button text={'Navigation'} style={{ marginTop: 10 }} onPress={() => {
          AppNavigator.example.NavigationScene()
        }} />

        <Button text={'Network'} style={{ marginTop: 10 }} onPress={() => {
          AppNavigator.example.NetworkScene()
        }} />

        <Button text={'State Management'} style={{ marginTop: 10 }} onPress={() => {
          AppNavigator.example.StateManagementScene()
        }} />
        <Button style={{ marginTop: 10 }} text={'Console log'} onPress={() => {
          ActionSheet.show({
            header: 'console不同格式log',
            items: [{
              text: 'string',
              onPress: () => {
                console.log('打印string：', '123456789')
              }
            }, {
              text: 'number',
              onPress: () => {
                console.log('打印number：', 123456789)
              }
            }, {
              text: 'boolean',
              onPress: () => {
                console.log('打印boolean：', Math.random()* 100 > 50)
              }
            }, {
              text: 'object',
              onPress: () => {
                console.log('打印object：', {a: 1, b: 2})
              }
            }, {
              text: 'array',
              onPress: () => {
                console.log('打印array：', [1, 2, 3, 4, 5, 6])
              }
            }]
          })
        }} />
      </View>
    )
  }
}
