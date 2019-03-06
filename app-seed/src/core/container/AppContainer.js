import React, { Component } from 'react'

import {
  View
} from 'react-native'

import { PopupStub } from '@unpourtous/react-native-popup-stub'
import PropTypes from 'prop-types'

// import TianYan, { Dashboard } from '@unpourtous/tianyan-react-native'

class AppContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <View onLayout={this._updateWindowSize} style={{
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

export default AppContainer
