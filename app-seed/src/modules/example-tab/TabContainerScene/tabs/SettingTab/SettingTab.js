/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-10-24T08:41:53.929Z.
 */
import React from 'react'
import { View, Text } from 'react-native'
import { WeBaseScene, NavBar } from '@webank/trident'

export default class SettingTab extends WeBaseScene {
  render () {
    return (
      <View>
        <NavBar
          title='SettingTab'
          hideLeftButton
        />
        <Text>Hello SettingTab</Text>
      </View>
    )
  }
}
