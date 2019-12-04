/**
 * Created by erichua on 26/12/2017.
 */
import React, { Component } from 'react'
import { StatusBar, Platform } from 'react-native'
import { TridentApp } from '@webank/trident'
import RNEnv from '@webank/trident/library/utils/RNEnv'
import {WTConsoleView} from './bizComponents/WTConsoleView'
import CardStackStyleInterpolator from '@unpourtous/react-navigation/src/views/CardStack/CardStackStyleInterpolator'

const navigationBarHeight = 44
const statusBarHeight = Platform.select({
  android: Platform.Version >= 21 ? StatusBar.currentHeight : 0,
  ios: 20 // ios: Device.isPhoneX() ? 44 : 20
})

export default class AppEntry extends Component {
  render () {
    // All you need to setup
    return (
      <TridentApp
        navigationConfig={{
          navigationOptions: {
            gesturesEnabled: true,
            headerBackTitle: null,
            headerTitleAllowFontScaling: false,
            headerStyle: Platform.select({
              android: {
                borderWidth: 0,
                borderBottomWidth: 0,
                elevation: 0,
                height: navigationBarHeight + statusBarHeight, // 导航栏 + 状态栏的高度
                paddingTop: statusBarHeight,
              },
              ios: {
                borderWidth: 0,
                borderBottomWidth: 0,
                elevation: 0
              }
            }),
            headerTitleStyle: {
              fontWeight: 'normal',
              textAlign: 'center'
            }
          },
          headerMode: 'screen',
          cardStyle: {
            // backgroundColor: 'red'
          },
          // make android and ios have the same transition effect
          transitionConfig: () => ({
            screenInterpolator: sceneProps => {
              return CardStackStyleInterpolator.forHorizontal(sceneProps)
            }
          })
        }}
        container={require('./container').default}
        modules={require('./modules').default}
        dyModules={require('./modules').dyModules}
        showWTConsole={!RNEnv.isRemoteDebug() && RNEnv.isDev()}
        wtConsoleOptions={{}}
        customWTConsoleTab={{
          name: '自定义',
          view: <WTConsoleView />
        }}
      />
    )
  }
}
