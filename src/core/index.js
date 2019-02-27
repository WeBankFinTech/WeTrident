/**
 * Created by erichua on 26/12/2017.
 */
import React, { Component } from 'react'
import AppContainer from './container/AppContainer'
import TridentApp from 'library/TridentApp'

export default class AppEntry extends Component {
  static propTypes = {}

  constructor (props) {
    super(props)
  }

  render () {
    // All you need to setup
    return (
      <TridentApp
        containerComponent={AppContainer}
        container={require('./container').default}
        modules={require('./modules').default} />
    )
  }
}
