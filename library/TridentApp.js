import {
  createStore,
  applyMiddleware
} from 'redux'
import { StatusBar } from 'react-native'
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
import ElementMark from './qualityTools/ElementMark'
import SceneTraversal from './qualityTools/SceneTraversal'
import RNEnv from './utils/RNEnv'

export default class TridentApp extends Component {
  static propTypes = {
    reduxConfig: PropTypes.object,
    navigationConfig: PropTypes.object,
    modules: PropTypes.array, // static modules
    dyModules: PropTypes.object, // dynamic modules,
    showWTConsole: PropTypes.bool,
    wtConsoleOptions: PropTypes.object // wtConsole config
  }

  constructor () {
    super(...arguments)

    ModuleManager.init(this.props.modules, this.props.container)

    const connectedResult = ModuleManager.connectModulesAll()

    // StackNavigator只支持扁平的配置，所以需要打扁一下
    this.connectedContainer = connectedResult.connectedContainer

    const staticRouterConfig = ModuleManager.flatModule(connectedResult.connectedModules)
    AppNavigator.init(staticRouterConfig)

    const { navigationConfig = require('./config/defaultNavigationConfig').default } = this.props
    this.WeNavigator = createTridentNavigator(staticRouterConfig, navigationConfig)

    this.store = createStore(
      combineAppReducers(
        undefined,
        connectedResult.connectedContainer,
        connectedResult.connectedModules,
        this.WeNavigator.MyStackNavigator,
        stateChangeListener
      ),
      undefined,
      this._getReduxMiddlewares()
    )
    AppNavigator.store = this.store
    AppNavigator.WeNavigator = this.WeNavigator
    AppNavigator._prepareDyModuleLoader(this.props.dyModules)
  }

  _getReduxMiddlewares () {
    const { reduxConfig = require('./config/defaultReduxConfig').default.logger } = this.props
    return applyMiddleware(...[
      createLogger(reduxConfig),
      thunk
    ])
  }

  render () {
    const Navigator = this.WeNavigator.stackNavigator

    let WTConsole
    if (this.props.showWTConsole) {
      WTConsole = require('@unpourtous/tianyan-react-native').default
    }
    return (
      <Provider store={this.store}>
        <this.connectedContainer>
          <StatusBar translucent backgroundColor='transparent' />
          <Navigator />
          <PopupStub maskColor='rgba(0,0,0,0.75)' ref={_ref => {
            if (_ref) PopupStub.init(_ref)
          }}
          />
          {WTConsole ? <WTConsole
            options={{
              logServerUrl: 'http://wt-console-server.com/upload',
              maxLogLine: 1000,
              ignoreFilter: function () {
                const filterRule = /%c prev state|%c next state|%c action|%c CHANGED|[action] Navigation\/|%c ADDED/g
                return ((arguments && typeof arguments[0] === 'string' && arguments[0].match(filterRule)) ||
                  (typeof arguments[1] === 'string' && arguments[1].match(filterRule)))
              },
              ...(this.props.wtConsoleOptions || {})
            }} /> : null}
          <ElementMark ref={_ref => SceneTraversal.setRef(_ref)} />
        </this.connectedContainer>
      </Provider>
    )
  }
}
