/**
 * Created by huazeng on 17/6/24.
 */

'use strict'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'

import React, { Component } from 'react'
import WeTouchable from '../ext/WeTouchable'
import Colors from '../../values/colors'
import PropTypes from 'prop-types'

export default class CustomTransferButton extends Component {
  static propTypes = {
    disabled: PropTypes.func,
    onPress: PropTypes.func,
    text: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      backgroundColor: '#dcb35f',
      textColor: '#fff'
    }
  }

  _highlight () {
    this.setState({backgroundColor: '#C5A055', textColor: 'E5E5E5'})
  }

  _reset () {
    this.setState({backgroundColor: '#dcb35f', textColor: 'fff'})
  }

  render () {
    const {style, buttonStyle, textStyle, disabled, onPress, text} = this.props
    return (
      <WeTouchable
        activeOpacity={1}
        disabled={disabled && disabled()}
        style={style}
        onPressIn={this._highlight.bind(this)}
        onPressOut={this._reset.bind(this)}
        onPress={() => {
          (!disabled || (disabled && !disabled())) && onPress && onPress()
        }}>
        <View style={[
          styles.button,
          buttonStyle,
          {
            backgroundColor: this.state.backgroundColor
          }]}>
          <Text style={[styles.text, textStyle, {color: '#fff'}]}>{text}</Text>
        </View>
      </WeTouchable>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonBackgroundColor
  },
  text: {
    fontSize: 14,
    color: Colors.buttonTextColor
  }
})
