/**
 * Created by erichua on 26/12/2017.
 */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import {
  createStore,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import ServerEnv from './api/ServerEnv'
import AppContainer from './container/AppContainer'
// import { RNEnv } from 'utils'
import WeNavigator, { navReduxMiddleware } from './navigation/WeNavigator'
import AppNavigator from './navigation/AppNavigator'
import reducer from './reducer'

const middlewares = []
// if (RNEnv.isDev() && RNEnv.isRemoteDebug()) {
//   if (RNEnv.isCloseLog()) {
//     console.warn('【注意】\n现在开启了模拟生产环境功能，关闭了所有的日志，让性能尽可能接近生产环境。\n没有了日志，具体的组件和函数调用耗时可以在Chrome调试工具的Performance中看到。')
//     let noop = () => {}
//     console.log = noop
//     console.info = noop
//     console.warn = noop
//     console.error = noop
//     console.groupCollapsed = noop
//     console.groupEnd = noop
//   } else {
//     middlewares.push(createLogger(require('./reduxLoggerConfig').default))
//     console.ignoredYellowBox = [
//       'Task orphaned for request',
//       'source.uri should not be an empty string'
//     ]
//   }
// }
middlewares.push(thunk)
middlewares.push(navReduxMiddleware)
const middleware = applyMiddleware(...middlewares)

export default class AppEntry extends Component {
  static propTypes = {}

  constructor (props) {
    super(props)
    this.store = createStore(
      reducer(AppNavigator.example.ChartExampleScene.toString()),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      middleware
    )

    AppNavigator.store = this.store
  }

  render () {
    return (
      <Provider store={this.store}>
        <AppContainer
          initProps={{
            ...this.props,
            env: ServerEnv.ENV_PREFIX
          }}>
          <WeNavigator />
        </AppContainer>
      </Provider>
    )
  }
}
