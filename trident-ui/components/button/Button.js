/**
 * Created by vengeanliu on 17/3/1.
 */

import PropTypes from 'prop-types'

import {
  View,
  Text,
  Keyboard
} from 'react-native'

import React from 'react'
import WeTouchable from '../../lib/WeTouchable'
import ThemeableComponent from '../../theme/ThemeableComponent'

export default class Button extends ThemeableComponent {
  namespace = 'Button'

  themeStyleKeys = [
    'style', 'textStyle'
  ]

  themeValueKeys = ['activeColor']

  static propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    text: PropTypes.string,

    activeColor: PropTypes.string
  }

  static defaultProps = {
  }

  render () {
    const {
      style,

      textStyle,
      activeColor
    } = this.getComponentTheme()

    const {
      disabled,
      onPress,
      text,
      rid
    } = this.props

    return (
      <WeTouchable
        rid={rid}
        needsOffscreenAlphaCompositing={!!disabled}
        pressMode={WeTouchable.pressMode.highlight}
        activeColor={activeColor}
        disabled={disabled}
        onPress={() => {
          if (!disabled && onPress) {
            Keyboard.dismiss()
            onPress()
          }
        }}
      >
        <View style={[style, this.props.style]}>
          <Text style={[{ color: '#fff', backgroundColor: 'transparent' }, textStyle]}>{text}</Text>
        </View>
      </WeTouchable>
    )
  }
}
