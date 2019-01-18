/**
 * Created by alisazou on 17/6/23.
 */

'use strict'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'

import React, { Component } from 'react'
import WeTouchable from '../ext/WeTouchable'
import PropTypes from 'prop-types'

export default class FixedButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    text: PropTypes.string
  }

  render () {
    const {style, buttonStyle, textStyle, disabled, onPress, text} = this.props

    return (
      <WeTouchable
        disabled={disabled}
        style={style}
        onPress={() => {
          !disabled && onPress && onPress()
        }}>
        <View style={[styles.button, buttonStyle, disabled ? {backgroundColor: '#cdcdce'} : null]}>
          <Text style={[styles.text, textStyle]}>{text}</Text>
        </View>
      </WeTouchable>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcb35f'
  },
  text: {
    fontSize: 18,
    color: '#fff'
  }
})
