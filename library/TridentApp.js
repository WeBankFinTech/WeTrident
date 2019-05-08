import {
  createStore,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import combineAppReducers from './combineAppReducers'
import createTridentNavigator from './navigation/WeNavigator'
import { generateRouteName } from './Navigation'
import { createGlobalConnect } from './reduxUtils'
import connectModules from './connectModules'
import { AppNavigator } from './navigation'

export default class TridentApp extends Component {
  static propTypes = {
    reduxConfig: PropTypes.object,
    navigationConfig: PropTypes.object
  }

  constructor () {
    super(...arguments)
    const middlewares = []
    
    const {reduxConfig, navigationConfig} = this.props
    middlewares.push(createLogger(reduxConfig || require('./reduxConfig').default.logger))
    console.ignoredYellowBox = [
      'Task orphaned for request',
      'source.uri should not be an empty string'
    ]
    middlewares.push(thunk)
    const middleware = applyMiddleware(...middlewares)

    // 路由名称为`moduleName.sceneName`
    const connectedContainer = createGlobalConnect(this.props.container)(this.props.container.component)
    const connectedModules = connectModules(this.props.modules, connectedContainer)

    const flatRouters = (() => {
      let result = {}
      const moduleNames = Object.keys(connectedModules.routers)
      for (let moduleName of moduleNames) {
        const sceneNames = Object.keys(connectedModules.routers[moduleName])
        for (let sceneName of sceneNames) {
          let routeName = generateRouteName(moduleName, sceneName)
          result[routeName] = connectedModules.routers[moduleName][sceneName]
        }
      }
      return result
    })()

    AppNavigator.init(flatRouters)

    this.WeNavigator = createTridentNavigator(flatRouters, navigationConfig)

    const store = createStore(
      combineAppReducers(undefined, connectedContainer, connectedModules, this.WeNavigator.MyStackNavigator),
      undefined,
      middleware
    )

    this.store = store
  }

  render () {
    const Navigator = this.WeNavigator.stackNavigator
    return (
      <Provider store={this.store}>
        {/*<this.props.containerComponent initProps={{ ...this.props }}>*/}
        <Navigator />
        {/*</this.props.containerComponent>*/}
      </Provider>
    )
  }
}
