/*
 * Toast，支持icon
 * @author Lemorili
*/
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { PopupStub } from '@unpourtous/react-native-popup-stub'
import Icon from '../icon/Icon'
import ProUI from '../../values/pro'
import PopupZIndex from './PopupZIndex'
import { iconNamePropType } from '../../propTypeUtils'
import ThemeableComponent from '../../theme/ThemeableComponent'

export default class Toast extends ThemeableComponent {
  namespace = 'Toast'
  static propTypes = {
    icon: iconNamePropType,
    msg: PropTypes.string,
    textStyle: PropTypes.style
  }

  static show (msg, icon, duration) {
    const id = PopupStub.addPopup(<Toast msg={msg} icon={icon} />, {
      mask: false,
      position: 'center',
      zIndex: PopupZIndex.Toast,
      delay: 0,
      duration: 100,
      animation: { from: { opacity: 0 }, to: { opacity: 1 } },
      easing: 'ease-in-out',
      scope: 'global'
    })
    // 自动关闭
    return new Promise((resolve) => {
      setTimeout(() => {
        PopupStub.removePopup(id)
        return resolve()
      }, duration > 0 ? duration : calcDuration(msg.length))
    })
  }

  render () {
    const hasIcon = !!this.props.icon
    const {
      theme: {
        style,
        styleWithIcon,
        textStyle
      }
    } = this.getComponentTheme()

    return (
      <View style={[style, hasIcon ? styleWithIcon : null]}>
        {hasIcon && <Icon
          style={styles.toastIcon}
          name={this.props.icon} />}
        <View>
          <Text style={[textStyle, this.props.textStyle]}>{this.props.msg}</Text>
        </View>
      </View>
    )
  }
}

const MAX_LENGTH = 10
const MIN_LENGTH = 4

function calcDuration (len) {
  if (len > MAX_LENGTH) {
    return 3000
  } else if (len < MIN_LENGTH) {
    return 1000
  } else {
    return Math.round(len / MAX_LENGTH * 3000)
  }
}

const styles = StyleSheet.create({
  toastX: {
  },
  toastIcon: {
    alignSelf: 'center',
    marginBottom: ProUI.spaceY.medium
  },
})
