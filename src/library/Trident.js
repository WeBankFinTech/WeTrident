import {
  createStore,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import combineAppReducers from './combineAppReducers'

export default class Trident extends Component {
  static propTypes = {
    entryScene: PropTypes.string
  }

  init () {
    const middlewares = []
    middlewares.push(createLogger(require('./reduxConfig').default.logger))
    console.ignoredYellowBox = [
      'Task orphaned for request',
      'source.uri should not be an empty string'
    ]
    middlewares.push(thunk)
    // middlewares.push(navReduxMiddleware)
    const middleware = applyMiddleware(...middlewares)

    const store = createStore(
      combineAppReducers(undefined, this.props.container, this.props.modules),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      middleware
    )

    this.store = store
    // AppNavigator.store = this.store
  }

  constructor () {
    super(...arguments)
    this.init()
  }

  render () {
    return (
      <Provider store={this.store}>
        {this.props.children}
      </Provider>
    )
  }
}
