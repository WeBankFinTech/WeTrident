import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableHighlight
} from 'react-native'
import PropTypes from 'prop-types'

import Icon from '../Icon/Icon'
import { ProUI } from '../values'
import WeWarningBar from './lib/WeWarningBar'
import {RenderUtils} from '../utils'

class FinancialInput extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool, // 自动聚焦，拉起键盘
    disabled: PropTypes.bool, // 是否不可更改

    amount: PropTypes.string,
    placeholder: PropTypes.string,

    topInfo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // 输入框头部提示信息
    bottomInfo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    warning: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onClear: PropTypes.func,

    style: PropTypes.object,
  }

  static defaultProps = {
    amount: '',
    autoFocus: false,
    disabled: false,
  }

  onFocus = () => {
    this.props.onFocus && this.props.onFocus()
  }
  onBlur = () => {
    this.props.onBlur && this.props.onBlur()
  }
  onChange = (value) => {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }
  onClear = () => {
    if (this.props.onClear) {
      this.props.onClear()
    }
  }

  render () {
    const {
      amount,
      topInfo,
      disabled = false,
      warning,
      bottomInfo,
      autoFocus,
      placeholder
    } = this.props

    let unit = this.getAmountInputUnit(amount)

    const isShowPlaceholder = placeholder && amount === ''
    const isShowClearButton = !disabled && amount

    return (
      <View style={[
        {paddingTop: ProUI.spaceY.medium, backgroundColor: ProUI.color.moduleBackground},
        this.props.style
      ]}>
        {topInfo ? <View style={{minHeight: ProUI.lineHeight.medium}}>
          {RenderUtils.switch([
            [typeof topInfo === 'string',
              <View style={{
                flexDirection: 'row',
                paddingLeft: ProUI.spaceX.large,
                alignItems: 'center'
              }}>
                <Text style={{
                  color: ProUI.color.sub,
                  fontSize: ProUI.fontSize.medium,
                  lineHeight: ProUI.lineHeight.medium
                }}>{topInfo}</Text>
              </View>],
            [topInfo, topInfo]
          ])}
        </View> : null}
        <View style={{
          flexDirection: 'row',
          height: 70,
          alignItems: 'center',
          paddingLeft: ProUI.spaceX.large,
          paddingRight: ProUI.spaceX.large,
          paddingBottom: 10
        }}>
          <TouchableWithoutFeedback accessibilityLabel={`金额 ${amount}`}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: ProUI.spaceX.medium
            }}>
              <Text style={{
                fontSize: 40,
                color: disabled ? ProUI.color.sub : ProUI.color.primary,
                marginRight: ProUI.spaceX.medium
              }}>¥</Text>
              <TextInput
                ref={(ref) => { if (ref) { this._textInputRef = ref } }}
                style={{
                  flex: 1,
                  fontSize: amount && amount.length > 10 ? 35 : 40,
                  color: isShowPlaceholder ? '#00000000' : (disabled ? ProUI.color.sub : ProUI.color.primary),
                  paddingVertical: 0
                }}
                autoFocus={autoFocus && !disabled}
                editable={!disabled}
                placeholderTextColor={ProUI.color.info}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChangeText={this.onChange}
                keyboardType={'numeric'}
                value={amount}
                underlineColorAndroid='transparent'
              />
              {isShowPlaceholder
                ? <View
                  pointerEvents='none'
                  style={{
                    height: 70,
                    position: 'absolute',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingLeft: 38,
                      color: ProUI.color.info,
                      backgroundColor: '#FFFFFF00'
                    }}>{placeholder}</Text>
                </View>
                : null}
            </View>
          </TouchableWithoutFeedback>

          {/* 有内容时显示清除按钮 */}
          {isShowClearButton
            ? <TouchableHighlight hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={this.onClear}>
              <Icon name={Icon.Names.clear} />
            </TouchableHighlight>
            : null}

          {unit ? <View style={{
            alignItems: 'center',
            position: 'absolute',
            bottom: 3,
            left: 35 + ProUI.spaceX.large - (unit.length > 1 ? 5 : 0)
          }}>
            <View style={{
              width: 3,
              height: 3,
              top: 0,
              position: 'absolute',
              backgroundColor: ProUI.color.moduleBackground,
              borderColor: ProUI.color.important,
              borderRightWidth: ProUI.realOnePixel,
              borderTopWidth: ProUI.realOnePixel,
              transform: [{rotate: '-45deg'}],
              zIndex: 1
            }} />
            <View style={{
              marginTop: 1.5,
              borderRadius: ProUI.smallBorderRadius,
              borderColor: ProUI.color.important,
              borderWidth: ProUI.realOnePixel,
              paddingHorizontal: ProUI.spaceX.small,
              paddingVertical: 1
            }}>
              <Text style={{fontSize: 10, color: ProUI.color.important}}>{unit}</Text>
            </View>
          </View> : null}
        </View>

        <View accessibilityLiveRegion={'assertive'}>
          <WeWarningBar content={warning} />
        </View>

        {bottomInfo // 如果小于起购金额，则不展示info
          ? <View>
            {RenderUtils.switch([
              [typeof bottomInfo === 'string',
                <View style={{
                  paddingTop: ProUI.spaceY.small,
                  paddingHorizontal: ProUI.spaceX.large,
                  paddingBottom: ProUI.spaceY.module
                }}>
                  <Text style={{
                    fontSize: ProUI.fontSize.small,
                    lineHeight: ProUI.lineHeight.small,
                    color: ProUI.color.sub
                  }}>{bottomInfo}</Text>
                </View>],
              [bottomInfo, bottomInfo]
            ])}
          </View>
          : null}
      </View>
    )
  }

  getAmountInputUnit (amount) {
    let unit
    if (amount) {
      let length = parseInt(amount).toString().length
      switch (length) {
        case 5:
          unit = '万'
          break
        case 6:
          unit = '十万'
          break
        case 7:
          unit = '百万'
          break
        case 8:
          unit = '千万'
          break
        case 9:
          unit = '亿'
          break
        case 10:
          unit = '十亿'
          break
        case 11:
          unit = '百亿'
          break
        case 12:
          unit = '千亿'
          break
        case 13:
          unit = '万亿'
          break
      }
    }
    return unit
  }
}

export default FinancialInput
