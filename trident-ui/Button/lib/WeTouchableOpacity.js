/**
 * Created by vengeanliu on 2017/7/6.
 */
import {
  TouchableOpacity,
  View
} from 'react-native'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class WeTouchableOpacity extends Component {
  static propTypes = {
    activeOpacity: PropTypes.number,
    onPress: PropTypes.func.isRequired
  }
  static defaultProps = {
    activeOpacity: 0.6,
    type: 'opacity'
  }

  render () {
    return (
      <TouchableOpacity
        {...this.props}
        onPress={() => {
          this.props.onPress()
        }}
        activeOpacity={this.props.activeOpacity || WeTouchableOpacity.defaultProps.activeOpacity}>
        {this.props.disabled ? <View style={{opacity: 0.3}}>{this.props.children}</View> : this.props.children}
      </TouchableOpacity>
    )
  }
}
