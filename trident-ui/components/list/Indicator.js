/**
 * Created by vengeanliu on 2017/8/7.
 * @deprecated
 * 这个组件废弃使用，使用系统自带的ActivityIndicator
 */
import {
  // Platform,
  ActivityIndicator,
  // View,
  // Animated,
  ViewPropTypes
  // Easing
} from 'react-native'
import React, { Component } from 'react'
import { ProUI } from '../../values'

export default class Indicator extends Component {
  static propTypes = {
    style: ViewPropTypes.style
  }

  render () {
    return <ActivityIndicator color={ProUI.color.third} style={this.props.style} />
  }
}
