/**
 * Created by vengeanliu on 17/3/1.
 */

import {
  View,
  StyleSheet,
  Text
} from 'react-native'

import React, { Component } from 'react'
import WeTouchable from '../ext/WeTouchable'
import PropTypes from 'prop-types'

export default class PrimaryButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
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
        disabled={disabled}
        onPressIn={this._highlight.bind(this)}
        onPressOut={this._reset.bind(this)}
        style={style}
        onPress={() => {
          !disabled && onPress && onPress()
        }}>
        <View
          style={[
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
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcb35f'
  },
  text: {
    fontSize: 18,
    color: '#fff'
  }
})
