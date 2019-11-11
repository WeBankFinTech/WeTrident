import React, { Component } from 'react'

import {
  View
} from 'react-native'
import { AppNavigator } from '@webank/trident'
import { Linking } from 'react-native'
import { LightTheme, createTheme, ThemeProvider, DarkTheme } from '@webank/trident/trident-ui/theme'

const lightTheme = createTheme(LightTheme, LightTheme)
const darkTheme = createTheme(LightTheme, DarkTheme)

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
    if (!url) {
      return
    }

    AppNavigator.jumpByURL(url)
  }

  render () {
    return (
      <ThemeProvider theme={this.props.theme === 'dark' ? darkTheme : lightTheme}>
        <View style={{
          flex: 1,
          alignSelf: 'stretch',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignContent: 'center',
        }}>
          {this.props.children}
        </View>
      </ThemeProvider>
    )
  }
}
