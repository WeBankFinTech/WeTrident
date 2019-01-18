/**
 * Created by vengeanliu on 17/2/27.
 */

'use strict'
import {
  View
} from 'react-native'

import React, {Component} from 'react'
import { WeColors } from '../../values'
import WeTouchable from '../ext/WeTouchable'

export default class NavMoreButton extends Component {
  constructor (props) {
    super(props)
    this.dotSize = 4
  };

  render () {
    return (
      <WeTouchable {...this.props}>
        <View
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingLeft: 15,
            paddingRight: 15,
            alignSelf: 'stretch'
          }}>
          <View
            style={{
              width: this.dotSize,
              height: this.dotSize,
              borderRadius: this.dotSize / 2,
              backgroundColor: WeColors.titleTextColor
            }} />
          <View
            style={{
              width: this.dotSize,
              height: this.dotSize,
              borderRadius: this.dotSize / 2,
              marginLeft: this.dotSize,
              marginRight: this.dotSize,
              backgroundColor: WeColors.titleTextColor
            }} />
          <View
            style={{
              width: this.dotSize,
              height: this.dotSize,
              borderRadius: this.dotSize / 2,
              backgroundColor: WeColors.titleTextColor
            }} />
        </View>
      </WeTouchable>
    )
  }
}
