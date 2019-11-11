/*
 * Toast，支持icon
 * @author Lemorili
*/
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { PopupStub } from '@unpourtous/react-native-popup-stub'
import Icon from './Icon'
import ProUI from './UI'
import PopupZIndex from './PopupZIndex'

export default class Toast extends Component {
  static propTypes = {
    iconSource: PropTypes.string,
    iconWidth: PropTypes.number,
    iconHeight: PropTypes.number,
    msg: PropTypes.string
  }

  // 一些内置的图标，便于统一
  static ICON = {
    SUCCESS: 'successWhite'
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

  static isShowing () {
    return PopupStub.isShow()
  }

  render () {
    const hasIcon = !!this.props.iconSource

    return (
      <View style={[styles.toast, hasIcon ? styles.toastX : null]}>
        {hasIcon && <Icon
          style={styles.toastIcon}
          source={this.props.iconSource}
          size={this.props.iconWidth}
        />}
        <View>
          <Text style={styles.toastMsg}>{this.props.msg}</Text>
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
  toast: {
    backgroundColor: 'rgba(0,0,0,.6)',
    borderRadius: ProUI.borderRadius,
    paddingHorizontal: ProUI.spaceX.large,
    paddingTop: 7,
    paddingBottom: 7
  },
  toastX: {
    paddingTop: 16,
    paddingBottom: ProUI.spaceY.medium
  },
  toastIcon: {
    alignSelf: 'center',
    marginBottom: ProUI.spaceY.medium
  },
  toastMsg: {
    color: ProUI.color.lightPrimary,
    fontSize: ProUI.fontSize.medium,
    lineHeight: ProUI.lineHeight.medium
  }
})
