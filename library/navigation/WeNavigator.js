import React from 'react'
import {
  addNavigationHelpers
} from '@unpourtous/react-navigation'
import { connect } from 'react-redux'
// import NavBackButton from '../bizComponents/button/NavBackButton'
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers'

const AppNavigator = require('./AppNavigator').default

const createTridentNavigator = (routers, stackNavigatorConfig) => {
  // 第一个参数是Router的配置，原始的StackNavigator只支持传入对象
  const MyStackNavigator = require('./react-navigation-ext/DyStackNavigator').default(() => routers, stackNavigatorConfig)

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
    stackNavigator: connect(mapStateToProps, undefined, undefined, { pure: true })(({ dispatch, navigation }) =>
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
