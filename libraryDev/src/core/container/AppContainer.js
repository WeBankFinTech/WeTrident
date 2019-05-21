import React, { Component } from 'react'

import {
  View,
  Linking
} from 'react-native'
import { AppNavigator } from '@webank/trident'

export default class AppContainer extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    Linking.addEventListener('url', ({ url }) => this._handleOpenURL(url))

    // deal with the first launch
    Linking.getInitialURL().then(this._handleOpenURL)
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', ({ url }) => this._handleOpenURL(url))
  }

  _handleOpenURL (url) {
    console.log(url)
    if (!url) {
      return
    }

    AppNavigator.jumpByURL(url)
  }

  render () {
    return <View style={{
      flex: 1,
      alignSelf: 'stretch',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignContent: 'center',
    }}>
      {this.props.children}
    </View>
  }
}
