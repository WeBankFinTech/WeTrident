/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-10-28T08:43:20.544Z.
 */
import React, { Component } from 'react'
import { AppNavigator, WeBaseScene } from '@webank/trident'
import { TabNavigator } from '@unpourtous/react-navigation'
import ModuleManager from '@webank/trident/library/navigation/ModuleManager'
import { createModuleConnect, createSceneConnect } from '@webank/trident/library/reduxUtils'
import ModulePrivate from '..'
import HomeTab from './tabs/HomeTab'
import SettingTab from './tabs/SettingTab'

export default class TabContainerScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    header: null
  })

  constructor (props) {
    super(props)
    this.navigatorRef = null

    const wrappedModule = createModuleConnect(ModulePrivate)()
    const homeTabConfig = HomeTab(ModuleManager.connectedContainer, wrappedModule)
    const settingTabConfig = SettingTab(ModuleManager.connectedContainer, wrappedModule)

    // 自定义样式请参考 https://reactnavigation.org/docs/en/1.x/tab-based-navigation.html#customizing-the-appearance
    this.MyTabNavigator = TabNavigator({
      'Home': createSceneConnect(homeTabConfig)(homeTabConfig.component),
      'Setting': createSceneConnect(settingTabConfig)(settingTabConfig.component)
    }, {
      initialRouteName: this.params.tab
    })
  }

  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
    if (this.navigatorRef && this.isTabExist(this.params.tab)) {
      this.navigatorRef._navigation.navigate(this.params.tab)
    }
  }

  render () {
    const MyTabNavigator = this.MyTabNavigator
    return (
      <MyTabNavigator ref={_ref => this.navigatorRef = _ref} />
    )
  }

  isTabExist (tabName) {
    const {
      state: {
        nav: {
          routes = []
        } = {}
      } = {}
    } = this.navigatorRef
    return !!routes.find(item => item.routeName === tabName)
  }
}
