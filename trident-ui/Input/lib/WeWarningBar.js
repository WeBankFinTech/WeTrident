/**
 * 组件功能：警告的橙色bar 多用于表单填写不符时显示的警告信息
 * created by raganyayoung on 2018/03/23
 */
import React, {Component} from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'

import PropTypes from 'prop-types'
import { ProUI } from '../../values'

export default class WeWarningBar extends Component {
  static propTypes = {
    content: PropTypes.string,
    style: PropTypes.any,
    renderContent: PropTypes.func
  }

  render () {
    const {
      content
    } = this.props

    if (!content) {
      return null
    }

    return (
      <View style={[styles.warning, this.props.style]}>
        <View style={[styles.triangleWrapper, Platform.OS === 'android' ? {bottom: -0.5} : null]}>
          <View style={[styles.triangle]} />
        </View>
        {this.props.renderContent ? (
          <View style={styles.txtWrap}>{this.props.renderContent()}</View>
        ) : (
          <Text style={styles.warningTxt}>{this.props.content}</Text>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  warning: {
    flexDirection: 'column',
    marginTop: -6
  },
  txtWrap: {
    backgroundColor: '#F5B191',
    paddingVertical: ProUI.spaceY.small,
    paddingHorizontal: ProUI.spaceX.large
  },
  warningTxt: {
    backgroundColor: '#F5B191',
    color: ProUI.color.lightPrimary,
    fontSize: ProUI.fontSize.small,
    lineHeight: ProUI.lineHeight.small,
    paddingVertical: ProUI.spaceY.small,
    paddingHorizontal: ProUI.spaceX.large
  },
  triangleWrapper: {
    width: 12,
    height: 6,
    overflow: 'hidden',
    left: ProUI.spaceX.large
  },
  triangle: {
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F5B191',
    overflow: 'hidden'
  }
})
