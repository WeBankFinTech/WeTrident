/**
 * Created by vengeanliu on 17/3/8.
 * Updated by lemorili
 */

'use strict'
import React, {Component} from 'react'
import {
  View,
  Text,
  TextInput,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'

import {CustomTextInput} from '@unpourtous/react-native-custom-keyboard'
import {Icon} from '../../apps/webankPro/bizComponents'
import {WeUI} from '../theme'
import PropTypes from 'prop-types'
import {WeTouchable} from '../'

export default class FormInput extends Component {
  static propTypes = {
    editable: PropTypes.bool,
    icon: PropTypes.string,
    value: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    style: PropTypes.object,
    titleStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    textProps: PropTypes.object,
    onChangeText: PropTypes.func,
    // onPress指按压整个输入框（比如用于只读状态的交互）
    onPress: PropTypes.func,
    // onPressIcon用于点击图标（比如选择联系人的图标）
    onPressIcon: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    unit: PropTypes.string
  }

  static defaultProps = {
    icon: 'clear',
    editable: true
  }

  constructor (props) {
    super(props)

    this.state = {
      focus: props.textProps && props.textProps.autoFocus
    }

    this.onBlur = this.onBlur.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onClear = this.onClear.bind(this)
    this.onPressIcon = this.onPressIcon.bind(this)
  }

  onPressIcon () {
    if (this.props.onPressIcon) {
      this.props.onPressIcon()
    } else if (this.props.onPress) {
      this.props.onPress()
    }
  }

  // 虽然TextInput有isFocused方法，但是其返回值不可靠
  onFocus () {
    this.setState({focus: true})
    if (this.props.textProps && typeof this.props.textProps.onFocus === 'function') {
      this.props.textProps.onFocus()
    }
    if (this.props.onFocus) {
      this.props.onFocus()
    }
  }

  // blur的时候不自动收起键盘，否则在两个输入框之间切换时，需要点击两次（一次关闭键盘，一次聚焦）
  onBlur () {
    this.setState({focus: false})
    if (this.props.textProps && typeof this.props.textProps.onBlur === 'function') {
      this.props.textProps.onBlur()
    }
    if (this.props.onBlur) {
      this.props.onBlur()
    }
  }

  // 清空输入框并自动focus
  onClear () {
    // 如果点击清除无反应，调用者应当补充回调函数。
    // 还有一种情况是，如果用了ScrollView，需设置其keyboardShouldPersistTaps为always，以免点击被键盘拦截。
    if (this.props.onChangeText) {
      this.props.onChangeText('')
    }

    this.focus()
  }

  // 此focus方法也会用于外部调用者主动focus输入框，因此不可精简掉
  focus () {
    this._textInputRef.input ? this._textInputRef.input.focus() : this._textInputRef.focus()
  }

  componentWillUnmount () {
    this._textInputRef = null
  }

  render () {
    let {
      inputStyle = {}
    } = this.props
    let hasInput = this.state.focus && this.props.editable && !!this.props.value
    let TextInputComponent = this.props.textProps && this.props.textProps.customKeyboardType ? CustomTextInput : TextInput
    // 在没有定义整个输入框的点击事件时，按压态无意义
    let TouchComponent = this.props.onPress ? WeTouchable : TouchableWithoutFeedback

    return (
      <View style={[styles.container, this.props.style]}>
        {!!this.props.title && <Text style={[styles.label, this.props.titleStyle]}>{this.props.title}</Text>}

        <TouchComponent style={{flex: 1}} activeOpacity={0.8} onPress={this.props.onPress}>
          <View style={styles.touchable}>
            <TextInputComponent
              ref={(_ref) => { this._textInputRef = _ref }}
              style={[styles.input, inputStyle]}
              placeholder={this.props.placeholder}
              placeholderTextColor={WeUI.color.placeholder}
              onChangeText={this.props.onChangeText}
              onSubmitEditing={this.props.onSubmitEditing}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              value={this.props.value}
              editable={this.props.editable}
              underlineColorAndroid='transparent'
              maxLength={this.props.maxLength}
              {...this.props.textProps}
            />

            {hasInput ? (
              <WeTouchable onPress={this.onClear}>
                <Icon style={styles.icon} name={'clear'} />
              </WeTouchable>
            ) : null}

            {!hasInput && this.props.icon !== 'clear' ? (
              <WeTouchable onPress={this.onPressIcon}>
                <Icon style={styles.icon} name={this.props.icon} />
              </WeTouchable>
            ) : null}
            {this.props.unit ? <Text style={{
              fontSize: WeUI.fontSize.medium,
              color: WeUI.color.normal,
              marginLeft: WeUI.spaceX.large
            }}>{this.props.unit}</Text> : null}
          </View>
        </TouchComponent>
      </View>
    )
  }
}

// 区别平台设置
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    height: WeUI.itemHeight,
    paddingLeft: 25
  },
  label: {
    width: 70,
    color: WeUI.color.normal,
    fontSize: WeUI.fontSize.medium
  },
  touchable: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: WeUI.itemHeight,
    paddingRight: 25
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 20,
    minWidth: 20
  },
  input: {
    flexGrow: 1,
    color: WeUI.color.normal,
    fontSize: WeUI.fontSize.medium,
    padding: 0,
    ...Platform.select({
      ios: {
        top: 0.5
      },
      android: {
        top: 0
      }
    })
  }
})
