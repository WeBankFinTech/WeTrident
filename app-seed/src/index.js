/**
 * Created by erichua on 26/12/2017.
 */
import React, { Component } from 'react'
import { AppNavigator, TridentApp, NavBar, RNEnv } from '@webank/trident'

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
              return <NavBar
                leftButtonImage={require('./images/icon-back.png')}
                hideLeftButton={AppNavigator.getCurrentRoutes().length <= 1}
                title={sceneDetail.options.headerTitle} onPressLeft={() => {
                AppNavigator.goBack()
              }} />
            }
          },
          headerMode: 'screen',
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
      />
    )
  }
}
