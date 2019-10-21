import React, {Component} from 'react'
import {
  View,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import { WeTouchable } from '@unpourtous/react-native-touchable'

export default class NavRightButton extends Component {
  static propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func
  }

  static defaultProps = {
    onPress: () => {}
  }

  render () {
    const {
      onPress,
      titleColor = '#007AFF',
    } = this.props
    return (
      <WeTouchable onPress={onPress}>
        <View
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          style={[{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingRight: 10,
            width: 70
          }, this.props.titleWrapperStyle]}>
          <Text
            style={{
              fontSize: 14,
              color: titleColor
            }}>{this.props.title}</Text>
        </View>
      </WeTouchable>
    )
  }
}
