import {
  View,
  StyleSheet,
  Text,
  Keyboard
} from 'react-native'

/**
 * Created by vengeanliu on 17/3/1.
 */

import PropTypes from 'prop-types'

import React, { Component } from 'react'
import WeTouchable from '../../lib/WeTouchable'
import { ProUI } from '../../values'
import ThemeableComponent from '../../theme/ThemeableComponent'

export default class Button extends ThemeableComponent {
  namespace = 'Button'
  static propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    text: PropTypes.string,
    activeColor: PropTypes.string
  }

  static defaultProps = {
    activeColor: ProUI.color.activeFilling,
  }

  render () {
    const {
      style,
      textStyle,
      activeColor,
    } = this.getComponentTheme()

    const {
      disabled,
      onPress,
      text,
      rid,
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
        }}>
        <View style={[style, this.props.style]}>
          <Text style={[{ color: '#fff', backgroundColor: 'transparent' }, textStyle]}>{text}</Text>
        </View>
      </WeTouchable>
    )
  }
}
