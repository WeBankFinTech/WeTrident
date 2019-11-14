/**
 * Created by vengeanliu on 2017/3/23.
 * 别问我为什么又封装多一层看起来毫无意义的组件，完全是填Animated.Value不支持array和object的坑
 */

'use strict'
import {
    Circle
} from 'react-native-svg'

import React, {Component} from 'react'
import {ProUI} from 'apps/webankPro/values'

export default class LoadingDemo extends Component {
  render () {
    return (
      <Circle cx='24' cy='24' r='21' strokeWidth='3' fill='none' stroke={ProUI.color.filling}
        strokeDashoffset={this.props.strokeDashOffset}
        strokeDasharray={this.props.strokeDasharray + ',' + 200} strokeLinecap='round' />
    )
  }
};
