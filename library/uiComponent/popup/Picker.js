/*
 * 通用选择器，适用于吸底的选择器（或Dialog）、吸顶的筛选框。
 *
 * 如果header和body需要通信（如局部loading状态），建议把header内容合并到body里面。
 * 如果内部逻辑过于复杂（如日期选择器、地址选择器），建议单独定制。
 *
 * @author Lemorili
*/
'use strict'
import React, { Component } from 'react'
import {
  View,
  Keyboard
} from 'react-native'
import PropTypes from 'prop-types'
import { PopupStub } from '@unpourtous/react-native-popup-stub'
import PickerHeader from './PickerHeader'
import { ProUI, dimens } from 'apps/webankPro/values'

export default class Picker extends Component {
  static propTypes = {
    // 主体内容
    body: PropTypes.element.isRequired,
    // 头部内容，如果为空（空串）则不显示；如果为字符串，自动套用PickerHeader。
    header: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    // PickerHeader默认带1px的底部分割线
    headerStyle: PropTypes.object,
    // 弹层预期高度（用于动画，实际为最小高度，最大高度固定为450）
    height: PropTypes.number,
    // Picker的id，如果自定义header或同时会出现多个Picker，建议自带id
    id: PropTypes.string,
    // 位置（吸底或吸顶），默认吸底
    position: PropTypes.oneOf(['top', 'bottom']),
    // 层级，默认100
    zIndex: PropTypes.number,
    // 关闭回调
    onClose: PropTypes.func
  }

  static defaultProps = {
    header: '',
    lock: false
  }

  static _id = null

  static show (options = {}) {
    if (!options.header && !options.body) {
      return null
    }

    const normalHeight = 450 + dimens.PORTRAIT_UNSAFE_AREA_BOTTOM_HEIGHT
    const height = Math.min(normalHeight, options.height || 100)
    const position = options.position || 'bottom'
    let keyframes = {
      from: { translateY: position === 'bottom' ? height : -height },
      to: { translateY: 0 }
    }
    // this might be tricky, be careful
    options.id = options.id || PopupStub.getNewId()

    Keyboard.dismiss()
    Picker._id = PopupStub.stub.addPopup(<Picker {...options} />, {
      id: options.id,
      mask: true,
      position: position,
      zIndex: options.zIndex || 100,
      delay: 0,
      duration: 300,
      animation: keyframes,
      easing: 'ease-in-out',
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      wrapperStyle: {alignSelf: 'stretch', minHeight: height, maxHeight: normalHeight}
    })

    return options.id
  }

  static hide (id) {
    PopupStub.stub.removePopup(id || Picker._id)
  }

  _onClose = () => {
    Picker.hide(this.props.id)
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render () {
    let {body, header, headerStyle, headerTextStyle} = this.props

    return (
      <View style={{flex: 1, backgroundColor: ProUI.color.moduleBackground}}>
        {
          !header
          ? null
          : typeof header === 'string'
          ? <PickerHeader header={header} style={headerStyle} headerTextStyle={headerTextStyle} onPress={this._onClose} />
          : header
        }
        {body}
      </View>
    )
  }
}
