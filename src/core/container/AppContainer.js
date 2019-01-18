import React, { Component } from 'react'

import {
  View
} from 'react-native'
import ProUI from '../values/pro'

import connect from './actionsReducer'
import { PopupStub } from '@unpourtous/react-native-popup-stub'
import PropTypes from 'prop-types'

// import TianYan, { Dashboard } from '@unpourtous/tianyan-react-native'

class AppContainer extends Component {
  constructor (props) {
    super(props)
  }

  // 监听原生的反向通知
  getChildContext () {
    return {
      initDataAfterLoginSuccess: (initParams) => {
        return this._initDataAfterLoginSuccess(initParams).then((result) => {
          if (result) {
            this._onBaseDataRequestSuccess(result)
          }
          return Promise.resolve(result)
        }, () => Promise.reject())
      }
    }
  }

  render () {
    return <View onLayout={this._updateWindowSize} style={{
      flex: 1,
      alignSelf: 'stretch',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignContent: 'center',
      backgroundColor: ProUI.color.pageBackground
    }}>
      {this.props.children}
      <PopupStub ref={_ref => {
        if (_ref) {
          PopupStub.init(_ref)
        }
      }} />
    </View>
  }
}

AppContainer.childContextTypes = {
  initDataAfterLoginSuccess: PropTypes.func
}

export default connect(AppContainer)
