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
import WeTouchable from '@unpourtous/react-native-touchable/library/WeTouchable'
import Theme from './Theme'

export default class PrimaryButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    text: PropTypes.string,
    rid: PropTypes.string, // 上报id
    needDyeing: PropTypes.bool, // 是否需要染色
    activeColor: PropTypes.string
  }

  static defaultProps = {
    activeColor: Theme.color.activeFilling
  }

  render () {
    const {
      style,
      buttonStyle,
      textStyle, // deprecated
      buttonTextStyle, // recommend
      disabled,
      onPress,
      text,
      oldRid,
      rid,
      needDyeing,
      activeColor
    } = this.props

    return (
      <WeTouchable
        rid={rid}
        needsOffscreenAlphaCompositing={!!disabled}
        oldRid={oldRid}
        needDyeing={needDyeing}
        pressMode={WeTouchable.pressMode.highlight}
        activeColor={activeColor}
        disabled={disabled}
        style={style}
        onPress={() => {
          if (!disabled && onPress) {
            Keyboard.dismiss()
            onPress()
          }
        }}
      >
        <View
          style={[
            styles.button,
            buttonStyle]}
        >
          <Text style={[styles.text, textStyle, { color: '#fff', backgroundColor: 'transparent' }, buttonTextStyle]}>{text}</Text>
        </View>
      </WeTouchable>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height: Theme.fixedRowHeight,
    borderRadius: Theme.fixedRowHeight / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.color.filling
  },
  text: {
    fontSize: Theme.fontSize.xlarge,
    color: Theme.color.lightPrimary
  }
})
