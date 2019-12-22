import React, { Component } from 'react'

import {
  View
  , Linking
} from 'react-native'
import { AppNavigator, TridentStat } from '@webank/trident'

TridentStat.setOnStatEventHandler(require('./stat').default)

export default class AppContainer extends Component {
  componentDidMount () {
    Linking.addEventListener('url', ({ url }) => this._handleOpenURL(url))

    // deal with the first launch
    Linking.getInitialURL().then(this._handleOpenURL)
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', ({ url }) => this._handleOpenURL(url))
  }

  _handleOpenURL (url) {
    if (!url) {
      return
    }

    AppNavigator.jumpByURL(url)
  }

  render () {
    return (
      <View style={{
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'center'
      }}
      >
        {this.props.children}
      </View>
    )
  }
}
