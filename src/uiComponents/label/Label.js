/**
 * Created by vengeanliu on 17/3/2.
 */

'use strict'
import {
    View,
    Text
} from 'react-native'

import React, {Component} from 'react'
import { ProUI } from 'apps/webankPro/values'

export default class Label extends Component {
  render () {
    return (
      <View style={{
        justifyContent: 'center',
        height: 16,
        paddingHorizontal: 1,
        borderWidth: ProUI.realOnePixel,
        borderRadius: 3,
        borderColor: ProUI.color.third,
        marginHorizontal: 2.5
      }}>
        <Text style={{
          color: ProUI.color.third,
          fontSize: ProUI.fontSize.small
        }}>{this.props.text ? this.props.text : this.props.children}</Text>
      </View>
    )
  }
}
