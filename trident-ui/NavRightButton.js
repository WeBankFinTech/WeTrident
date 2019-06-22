/**
 * Created by vengeanliu on 17/2/27.
 */

'use strict'
import {
  View,
  Text
} from 'react-native'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import WeTouchable from '@unpourtous/react-native-touchable/library/WeTouchable'

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
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingHorizontal: 16
          }}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 14,
              marginBottom: 2
            }}>{this.props.title}</Text>
        </View>
      </WeTouchable>
    )
  }
}
