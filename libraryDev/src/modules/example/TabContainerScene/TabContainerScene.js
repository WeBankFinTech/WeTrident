/**
 * 负责用户交互逻辑
 *
 * Created by rcrabwu on 2019-12-07T10:18:48.246Z.
 */
import React from 'react'
import { Image } from 'react-native'
import { WeBaseScene, ModuleManager, createModuleConnect, createSceneConnect, dimens } from '@webank/trident'
import { TabNavigator, DrawerNavigator, TabBarBottom } from '@unpourtous/react-navigation'
import Sidebar from './components/Sidebar'
import ModulePrivate from '../'
import HomeTab from './tabs/HomeTab'
import UITab from './tabs/UITab'

export default class TabContainerScene extends WeBaseScene {
  static navigationOptions = ({ navigation: { state: { params = {} } } }) => ({
    header: null
  })

  constructor (props) {
    super(props)

    const wrappedModule = createModuleConnect(ModulePrivate('example'))()
    const homeTabConfig = HomeTab(ModuleManager.connectedContainer, wrappedModule)
    const uiTabConfig = UITab(ModuleManager.connectedContainer, wrappedModule)

    // 自定义样式请参考 https://reactnavigation.org/docs/en/1.x/tab-based-navigation.html#customizing-the-appearance
    const MyTabNavigator = TabNavigator({
      Home: createSceneConnect(homeTabConfig)(homeTabConfig.component),
      UI: createSceneConnect(uiTabConfig)(uiTabConfig.component)
    }, {
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state
          let iconSource
          if (routeName === 'Home') {
            iconSource = focused ? require('../images/icon-home-focus.png') : require('../images/icon-home.png')
          } else if (routeName === 'UI') {
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

    this.MyDrawerNavigator = new DrawerNavigator(
      {
        TabContainer: MyTabNavigator
      },
      {
        contentComponent: Sidebar,
        headerMode: 'screen',
        drawerWidth: dimens.WINDOW_WIDTH - 64,
        drawerPosition: 'left',
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle'
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
