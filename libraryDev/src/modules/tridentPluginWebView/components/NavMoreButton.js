import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { WeTouchable } from '@unpourtous/react-native-touchable'

export default class NavMoreButton extends Component {
  static defaultProps = {
    onPress: () => {}
  }

  constructor (props) {
    super(props)
    this.dotSize = 4
  }

  render () {
    const {
      onPress,
      dotColor = '#007AFF',
      dotSize = this.dotSize
    } = this.props
    return (
      <WeTouchable onPress={onPress}>
        <View
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
            alignSelf: 'stretch',
            paddingRight: 15
          }}
        >
          <View
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: dotColor
            }}
          />
          <View
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              marginLeft: dotSize,
              marginRight: dotSize,
              backgroundColor: dotColor
            }}
          />
          <View
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: dotColor
            }}
          />
        </View>
      </WeTouchable>
    )
  }
}
