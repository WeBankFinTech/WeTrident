/*
 * 按钮组
 * @lemorili
*/

/* ------------------------------
支持的group属性：

 - onPress: 自定义点击事件，参数为(按钮序号，原本是否active)
 - groupStyle: 自定义整体样式，比如margin
 - buttonStyle: 自定义button共用样式，比如height
 - textStyle: 自定义按钮文本共用样式，比如fontSize
 - borderRadius: 圆角大小
 - activeColor: 当前按钮文本颜色，也是非当前按钮背景颜色
 - inactiveColor: 与activeColor相对，同时也是borderColor

支持的按钮独立属性：

 - onPress: 自定义点击事件，参数为(按钮序号，原本是否active)；如果有，会覆盖group同名属性

------------------------------ */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Platform, ViewPropTypes } from 'react-native'

// const Button = require('react-native-scrollable-tab-view/Button')

import UI from '../../values/ui'
import WeTouchable from '../ext/WeTouchable'

class Optional extends Component {
  render () {
    return <WeTouchable onPress={this.props.onPress} style={[{flex: 1}, this.props.style]} pressMode='none'>
      <View style={[
        styles.btn,
        this.props.buttonStyle,
        {
          backgroundColor: this.props.active ? this.props.inactiveColor : this.props.activeColor
        }
      ]}>
        <Text style={[
          styles.text,
          {color: this.props.active ? this.props.activeColor : this.props.inactiveColor},
          this.props.textStyle
        ]}>{this.props.name}</Text>
      </View>
    </WeTouchable>
  }
}

export default class ButtonGroup extends Component {
  static propTypes = {
    active: PropTypes.number,
    activeColor: PropTypes.string,
    inactiveColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    groupStyle: ViewPropTypes.style
  }

  static defaultProps = {
    borderRadius: UI.borderRadius,
    activeColor: '#fff',
    inactiveColor: '#cdcdce'
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      active: this.props.active || 0
    }
  }

  render () {
    let {options, groupStyle, buttonStyle, activeColor, inactiveColor, textStyle} = this.props
    let count = options.length

    return (
      <View style={[styles.group, groupStyle, {borderColor: inactiveColor}]}>
        {options.map((option, index) => <Optional
          style={{
            borderColor: inactiveColor,
            borderLeftWidth: index !== 0 ? UI.borderWidth : 0
          }}
          buttonStyle={[
            buttonStyle,
            index === 0 && Platform.OS !== 'ios' ? {borderTopLeftRadius: UI.borderRadius, borderBottomLeftRadius: UI.borderRadius} : null,
            index === count - 1 && Platform.OS !== 'ios' ? {borderTopRightRadius: UI.borderRadius, borderBottomRightRadius: UI.borderRadius} : null
          ]}
          active={this.state.active === index}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          textStyle={textStyle}
          onPress={() => {
            this.setState({active: index})
            option.onPress && option.onPress()
          }}
          name={option.name}
          key={index}
        />)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  group: {
    borderWidth: UI.borderWidth,
    borderRadius: UI.borderRadius,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  text: {
    fontSize: 14
  },
  btn: {
    height: 35,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
