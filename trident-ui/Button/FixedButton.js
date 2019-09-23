
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import { ProUI } from '../values'

/**
 * Created by alisazou on 17/6/23.
 */

import PropTypes from 'prop-types'

import React, { Component } from 'react'
import WeTouchable from './lib/WeTouchable'
import { Device } from '../utils'

export default class FixedButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    text: PropTypes.string
  }

  render () {
    const {style, buttonStyle, textStyle, disabled, onPress, text, pressMode, activeColor} = this.props

    return (
      <View style={[styles.container, style]}>
        <WeTouchable
          needsOffscreenAlphaCompositing={!!disabled}
          pressMode={pressMode || WeTouchable.pressMode.highlight}
          activeColor={activeColor || ProUI.color.activeFilling}
          disabled={disabled}
          onPress={() => {
            !disabled && onPress && onPress()
          }}>
          <View style={[styles.button, buttonStyle]}>
            <Text style={[styles.text, textStyle]}>{text}</Text>
          </View>
        </WeTouchable>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Device.isPhoneX() ? 34 : 0,
    backgroundColor: ProUI.color.pageBackground
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ProUI.color.filling
  },
  text: {
    fontSize: ProUI.fontSize.xlarge,
    color: ProUI.color.lightPrimary,
    backgroundColor: 'transparent'
  }
})
