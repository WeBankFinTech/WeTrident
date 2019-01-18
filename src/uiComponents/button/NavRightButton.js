/**
 * Created by vengeanliu on 17/2/27.
 */

'use strict'
import {
  View,
  Text
} from 'react-native'

import React, {Component} from 'react'
import { WeColors } from '../../values'
import WeTouchable from '../ext/WeTouchable'
import WeRedDot from '../biz/reddot/WeRedDot'
import PropTypes from 'prop-types'

export default class NavRightButton extends Component {
  static propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    disable: PropTypes.bool,
    redDotConfig: PropTypes.object
  }
  render () {
    return (
      <WeTouchable {...this.props}>
        <View
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 14,
              marginBottom: 2,
              color: this.props.disable ? WeColors.textColorGray : WeColors.titleTextColor
            }}>{this.props.title}</Text>
          {this.props.redDotConfig ? <WeRedDot
            {...this.props.redDotConfig}
            style={{
              position: 'absolute',
              right: 0,
              top: 0
            }} /> : null}
        </View>
      </WeTouchable>
    )
  }
}
