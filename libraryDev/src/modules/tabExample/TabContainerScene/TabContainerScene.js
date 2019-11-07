/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-10-28T08:43:20.544Z.
 */
import React, { Component } from 'react'
import { AppNavigator, WeBaseScene } from '@webank/trident'
import { TabNavigator } from '@unpourtous/react-navigation'
import HomeTab from './tabs/HomeTab/HomeTab'
import SettingTab from './tabs/SettingTab/SettingTab'

const MyTabNavigator =  TabNavigator({
  'HomeTab': HomeTab,
  'SettingTab': SettingTab
}, {
  // initialRouteName: 'SettingTab'
})

export default class TabContainerScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    // headerTitle: params.title || 'TabContainerScene',
    header: null
  })

  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
    console.log(123, this.props)
    this.props.navigation.navigate(this.params.tab)
  }

  render () {
    return (
      <MyTabNavigator />
    )
  }
}
