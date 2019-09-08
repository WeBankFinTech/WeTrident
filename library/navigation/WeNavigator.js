import React from 'react'
import {
  Platform
} from 'react-native'
import {
  addNavigationHelpers
} from '@unpourtous/react-navigation'
import { connect } from 'react-redux'
// import NavBackButton from '../bizComponents/button/NavBackButton'
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers'

let AppNavigator = require('./AppNavigator').default

const createTridentNavigator = (routers, navigationConfig) => {
  const stackConfig = navigationConfig || {
    backgroundColor: 'yellow',
    navigationOptions: {
      gesturesEnabled: true,
      headerBackTitle: null,
      headerTitleAllowFontScaling: false,
      headerStyle: {
        borderWidth: 0,
        borderBottomWidth: 0,
        elevation: 0
      },
      headerTitleStyle: {
        fontWeight: 'normal',
        textAlign: 'center'
      }
    },
    headerMode: 'screen'
  }

  let MyStackNavigator

// 第一个参数是Router的配置，原始的StackNavigator只支持传入对象

  MyStackNavigator = require('./react-navigation-ext/DyStackNavigator').default(() => routers, stackConfig)

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
  const navReduxMiddleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.navigation
  )
  const addListener = createReduxBoundAddListener('root')
  const mapStateToProps = state => ({ navigation: state.navigation })

  return {
    navReduxMiddleware,
    MyStackNavigator,
    stackNavigator: connect(mapStateToProps)(({ dispatch, navigation }) =>
      <MyStackNavigator
        ref={navigator => { navigator && (AppNavigator.navigator = navigator) }}
        navigation={addNavigationHelpers({
          dispatch,
          state: navigation,
          addListener
        })}
      />
    )
  }

}

export default createTridentNavigator
