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
import WeTouchable from '../lib/WeTouchable'
import { ProUI } from '../values'

export default class Button extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    text: PropTypes.string,
    activeColor: PropTypes.string,
    withRadius: PropTypes.bool
  }

  static defaultProps = {
    activeColor: ProUI.color.activeFilling,
    withRadius: true
  }

  render () {
    const {
      style,
      disabled,
      onPress,
      text,
      rid,
      activeColor,
      withRadius
    } = this.props

    return (
      <WeTouchable
        rid={rid}
        needsOffscreenAlphaCompositing={!!disabled}
        pressMode={WeTouchable.pressMode.highlight}
        activeColor={activeColor}
        disabled={disabled}
        style={style}
        onPress={() => {
          if (!disabled && onPress) {
            Keyboard.dismiss()
            onPress()
          }
        }}>
        <View
          style={[styles.button, withRadius ? {borderRadius: ProUI.fixedRowHeight / 2} : null]}>
          <Text style={{color: '#fff', backgroundColor: 'transparent'}}>{text}</Text>
        </View>
      </WeTouchable>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: ProUI.spaceX.medium,
    height: ProUI.fixedRowHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ProUI.color.filling
  },
  text: {
    fontSize: ProUI.fontSize.xlarge,
    color: ProUI.color.lightPrimary
  }
})
