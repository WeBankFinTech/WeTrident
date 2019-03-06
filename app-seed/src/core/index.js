/**
 * Created by erichua on 26/12/2017.
 */
import React, { Component } from 'react'
// import AppContainer from './container/AppContainer'
import TridentApp from '@unpourtous/trident/TridentApp'

export default class AppEntry extends Component {
  render () {
    // All you need to setup
    return (
      <TridentApp
        container={require('./container').default}
        modules={require('./modules').default} />
    )
  }
}
