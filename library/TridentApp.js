import {
  createStore,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import combineAppReducers from './reduxUtils/combineAppReducers'
import createTridentNavigator from './navigation/WeNavigator'
import { AppNavigator } from './navigation'
import PropTypes from 'prop-types'
import { PopupStub } from '@unpourtous/react-native-popup-stub'
import stateChangeListener from './navigation/stateChangeListener'
import ModuleManager from './navigation/ModuleManager'

export default class TridentApp extends Component {
  static propTypes = {
    reduxConfig: PropTypes.object,
    navigationConfig: PropTypes.object,
    modules: PropTypes.array, // static modules
    dyModules: PropTypes.func, // dynamic modules
  }

  constructor () {
    super(...arguments)
    const middlewares = []

    const {reduxConfig, navigationConfig} = this.props
    middlewares.push(createLogger(reduxConfig || require('./reduxUtils/reduxConfig').default.logger))
    console.ignoredYellowBox = [
      'Task orphaned for request',
      'source.uri should not be an empty string'
    ]
    middlewares.push(thunk)
    const middleware = applyMiddleware(...middlewares)

    ModuleManager.init(this.props.modules, this.props.container)

    const connectedResult = ModuleManager.connectModulesAll()
    // this.connectedContainer = createGlobalConnect(this.props.container)(this.props.container.component)
    // const connectedModules = ModuleManager.connectModules(this.connectedContainer)
    // StackNavigator只支持扁平的配置，所以需要打扁一下
    const flatRouters = ModuleManager.flatModule(connectedResult.connectedModules)

    this.connectedContainer = connectedResult.connectedContainer

    AppNavigator.init(flatRouters, this.props.dyModules)

    this.WeNavigator = createTridentNavigator(flatRouters, navigationConfig)

    this.store = createStore(
      combineAppReducers(
        undefined,
        connectedResult.connectedContainer,
        connectedResult.connectedModules,
        this.WeNavigator.MyStackNavigator,
        stateChangeListener
      ),
      undefined,
      middleware
    )
    AppNavigator.store = this.store
    AppNavigator.WeNavigator = this.WeNavigator
  }

  render () {
    const Navigator = this.WeNavigator.stackNavigator
    return (
      <Provider store={this.store}>
        <this.connectedContainer initProps={{ ...this.props }}>
        <Navigator />
        <PopupStub maskColor='rgba(0,0,0,0.75)' ref={_ref => {
          if (_ref) PopupStub.init(_ref)
        }} />
        </this.connectedContainer>
      </Provider>
    )
  }
}
