/**
 * Created by erichua on 26/12/2017.
 */
import React, { Component } from 'react'
import { AppNavigator, TridentApp, NavBar, RNEnv } from '@webank/trident'

import { WTConsoleView } from './bizComponents/WTConsoleView'
import CardStackStyleInterpolator from '@unpourtous/react-navigation/src/views/CardStack/CardStackStyleInterpolator'

import { LightTheme, createTheme } from '@webank/trident'

const weuiTheme = createTheme(LightTheme)

export default class AppEntry extends Component {
  render () {
    // All you need to setup
    return (
        <TridentApp
          theme={weuiTheme}
          navigationConfig={{
            navigationOptions: {
              gesturesEnabled: true,
              header: ({ scene, getScreenDetails, navigation: { state: { params = {} } } }) => {
                const sceneDetail = getScreenDetails(scene)
                return <NavBar title={sceneDetail.options.headerTitle} onPressLeft={() => {
                  AppNavigator.goBack()
                }} />
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
