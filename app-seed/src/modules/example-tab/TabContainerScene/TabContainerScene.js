/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-10-28T08:43:20.544Z.
 */
import React from 'react'
import { Image } from 'react-native'
import {
  WeBaseScene,
  ModuleManager,
  createModuleConnect,
  createSceneConnect,
  Theme,
  WeDrawerNavigator
} from '@webank/trident'
import { TabNavigator, TabBarBottom } from '@unpourtous/react-navigation'
import ModulePrivate from '../'
import HomeTab from './tabs/HomeTab'
import SettingTab from './tabs/SettingTab'

export default class TabContainerScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    header: null
  })

  constructor (props) {
    super(props)

    const wrappedModule = createModuleConnect(ModulePrivate('example'))()
    const homeTabConfig = HomeTab(ModuleManager.connectedContainer, wrappedModule)
    const settingTabConfig = SettingTab(ModuleManager.connectedContainer, wrappedModule)

    // 自定义样式请参考 https://reactnavigation.org/docs/en/1.x/tab-based-navigation.html#customizing-the-appearance
    const MyTabNavigator = TabNavigator({
      Home: createSceneConnect(homeTabConfig)(homeTabConfig.component),
      Setting: createSceneConnect(settingTabConfig)(settingTabConfig.component)
    }, {
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state
          let iconSource
          if (routeName === 'Home') {
            iconSource = focused ? require('../images/icon-home-focus.png') : require('../images/icon-home.png')
          } else if (routeName === 'Setting') {
            iconSource = focused ? require('../images/icon-setting-focus.png') : require('../images/icon-setting.png')
          }

          // You can return any component that you like here! We usually use an
          // icon component from react-native-vector-icons
          return <Image style={{ width: 25, height: 25 }} source={iconSource} resizeMode='cover' />
        }
      }),
      tabBarComponent: TabBarBottom,
      tabBarPosition: 'bottom',
      initialRouteName: this.params.initialTab
    })

    this.MyDrawerNavigator = new WeDrawerNavigator(
      {
        TabContainer: MyTabNavigator,
        TabContainer2: MyTabNavigator
      },
      {
        drawerBackgroundColor: 'rgba(255,255,255,.9)',
        contentOptions: {
          activeTintColor: Theme.Color.textLightPrimary,
          activeBackgroundColor: Theme.Color.backgroundPrimary
        }
      }
    )
  }

  onResume (fromScene, toScene) {
    super.onResume(fromScene, toScene)
  }

  render () {
    const MyDrawerNavigator = this.MyDrawerNavigator
    return (
      <MyDrawerNavigator />
    )
  }
}
