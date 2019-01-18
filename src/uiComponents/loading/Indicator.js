/**
 * Created by vengeanliu on 2017/8/7.
 * @deprecated
 * 这个组件废弃使用，使用系统自带的ActivityIndicator
 */
import {
  ActivityIndicator
} from 'react-native'
import React, {Component} from 'react'
import {ProUI} from 'apps/webankPro/values'

export default class Indicator extends Component {
  render () {
    return <ActivityIndicator color={ProUI.color.third} style={this.props.style} />
  }
}
