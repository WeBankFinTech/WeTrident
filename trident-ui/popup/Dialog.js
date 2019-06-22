/*
 * 居中的对话框
 * Created by vengeanliu on 17/3/4.
 * Updated by lemorili
 */
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { PopupStub } from '@unpourtous/react-native-popup-stub'

import {WeTouchable} from '@unpourtous/react-native-touchable'
// import WePropTypes from '../ext/WePropTypes'
import ProUI from './UI'
import PreDefinedAnimation from './PreDefinedAnimation'
import PopupZIndex from './PopupZIndex'

const DEFAULT_OPTIONS = {
  autoClose: false,
  mask: true,
  zIndex: PopupZIndex.Dialog,
  delay: 0,
  duration: 200,
  maskDuration: 200,
  easing: 'ease-in-out',
  useNativeDriver: true
}

export default class Dialog extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    texts: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
    items: PropTypes.array,
    icon: PropTypes.element,
    vertical: PropTypes.bool,
    autoClose: PropTypes.bool,
    // containerStyle: WePropTypes.viewPropTypesStyle,
    // contentStyle: WePropTypes.viewPropTypesStyle,
    // titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    // renderContent: WePropTypes.func // 定制内容，兼容公告的可滑动
  }

  static AnimationType = {
    CenterDialog: PreDefinedAnimation.scaleInOut,
    BottomDialog: PreDefinedAnimation.slideUpDown
  }

  static _id

  // Dialog默认居中显示，有一个蒙层，不自动关闭
  // data为dialog的内容，也可以是自定义的component（向后兼容，以后可能转移到新的独立组件）
  // options用于自定义dialog的一些属性，如层级、锁定模式、蒙层、动画等
  static show (data, options = {}) {
    let comp = <Dialog {...data} />
    let opt = Object.assign({}, DEFAULT_OPTIONS, options)

    if (React.isValidElement(data)) {
      // 这种的动画不做默认值
      comp = data
      opt.position = 'none'
      opt.wrapperStyle = {flex: 1}
    } else {
      opt.position = 'center'
      opt.wrapperStyle = null
      opt = {
        ...opt,
        name: 'Dialog',
        animation: !data.deleteAnimation && PreDefinedAnimation.scaleInOut.openAnimation,
        closingAnimation: PreDefinedAnimation.scaleInOut.closingAnimation
      }
    }

    // 自定义的element，从视觉规范上看，不属于dialog，但为了向后兼容，暂时保留
    // 但是不开放position和wrapperStyle属性，element需负责自身位置、结构和样式
    Dialog._id = PopupStub.stub.addPopup(comp, opt)

    return Dialog._id
  }

  static hide (id) {
    PopupStub.stub.removePopup(id || Dialog._id)
  }

  render () {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.content, this.props.contentStyle]}>
          {this.props.icon && <View style={{alignItems: 'center', marginBottom: ProUI.spaceY.small}}>
            {this.props.icon}
          </View>}
          {this.props.title ? <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text> : null}
          {React.isValidElement(this.props.texts) ? {...this.props.texts}
            : this.props.texts && this.props.texts.length > 0 && this.props.texts.map((text, index) => (
            <Text style={[styles.text, {marginTop: index === 0 ? 0 : ProUI.spaceY.small}]} key={index}>{text}</Text>
          ))}
          {this.props.renderContent && this.props.renderContent()}
        </View>
        <View style={this.props.vertical ? null : styles.flexRow}>
          {this.props.items.map((item, index) => (
            <WeTouchable
              key={index}
              pressMode={item.pressMode}
              onPress={item.onItemPress ? () => item.onItemPress() : () => Dialog.hide()}
              style={[
                this.props.vertical ? styles.itemVertical : styles.item,
                !this.props.vertical && index > 0 && {
                  borderLeftWidth: ProUI.realOnePixel,
                  borderColor: ProUI.color.border
                }
              ]}>
              <View
                key={index}
              >
                <Text style={[styles.itemText, item.textStyle]}>{item.text}</Text>
              </View>
            </WeTouchable>
          ))}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 270,
    backgroundColor: ProUI.color.moduleBackground,
    borderRadius: ProUI.borderRadius,
    shadowColor: 'rgba(12, 2, 3, 0.6)',
    shadowRadius: 6,
    overflow: 'hidden'
  },
  content: {
    minHeight: 96,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    color: ProUI.color.primary,
    fontSize: ProUI.fontSize.xlarge,
    lineHeight: ProUI.lineHeight.xlarge,
    textAlign: 'center'
  },
  text: {
    color: ProUI.color.primary,
    fontSize: ProUI.fontSize.large,
    lineHeight: ProUI.lineHeight.large,
    textAlign: 'center',
    marginTop: ProUI.spaceY.small
  },
  flexRow: {
    borderColor: ProUI.color.border,
    borderTopWidth: ProUI.realOnePixel,
    flexDirection: 'row'
  },
  item: {
    height: ProUI.fixedRowHeight,
    flex: 1,
    justifyContent: 'center'
  },
  itemVertical: {
    height: ProUI.fixedRowHeight,
    borderTopWidth: ProUI.realOnePixel,
    borderColor: ProUI.color.border,
    justifyContent: 'center'
  },
  itemText: {
    color: ProUI.color.link,
    fontSize: ProUI.fontSize.xlarge,
    textAlign: 'center'
  }
})
