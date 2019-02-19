import {
  createStore,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'

export default class Trident extends Component {
  static propTypes = {
    reducer: PropTypes.func,
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

    const reducer = this.props.reducer(undefined)
    const store = createStore(
      reducer,
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
