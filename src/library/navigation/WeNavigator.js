import React from 'react'
import {
  Platform
} from 'react-native'
import {
  addNavigationHelpers
} from 'react-navigation'
import { connect } from 'react-redux'
// import NavBackButton from '../bizComponents/button/NavBackButton'
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers'
import { generateRouteName } from '../../utils'

const isDyLoad = require('./dyConfig.json').isDyLoad
let modules
if (isDyLoad) {
  // modules = require('../../core/modules/dyIndex').default
} else {
  modules = require('../../core/modules').default
}

let AppNavigator = require('./AppNavigator').default

// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'

const stackConfig = {
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
// 路由名称为`moduleName.sceneName`
const routers = (() => {
  let result = {}
  const moduleNames = Object.keys(modules.routers)
  for (let moduleName of moduleNames) {
    const sceneNames = Object.keys(modules.routers[moduleName])
    for (let sceneName of sceneNames) {
      let routeName = generateRouteName(moduleName, sceneName)
      result[routeName] = modules.routers[moduleName][sceneName]
    }
  }
  return result
})()
if (isDyLoad) {
  AppNavigator.init(routers)

  // 第一个参数是Router的配置，DyStackNavigator改造支持传入函数实现对动态变化的router配置的支持
  MyStackNavigator = require('./dynamic/react-navigation-ext/DyStackNavigator').default(() => routers, stackConfig)
} else {
  AppNavigator.init(routers)
  // 第一个参数是Router的配置，原始的StackNavigator只支持传入对象
  MyStackNavigator = require('react-navigation').StackNavigator(routers, stackConfig)
}

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
const navReduxMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.navigation
)
const addListener = createReduxBoundAddListener('root')
export {
  navReduxMiddleware
}
export {
  MyStackNavigator
}

const mapStateToProps = state => ({navigation: state.navigation})

export default connect(mapStateToProps)(({dispatch, navigation}) =>
  <MyStackNavigator
    ref={navigator => { navigator && (AppNavigator.navigator = navigator) }}
    navigation={addNavigationHelpers({
      dispatch,
      state: navigation,
      addListener
    })}
  />
)
