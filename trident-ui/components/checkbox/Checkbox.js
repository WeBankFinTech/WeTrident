import {
  Image,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes
} from 'react-native'
import PropTypes from 'prop-types'

import React from 'react'
import ThemeableComponent from '../../theme/ThemeableComponent'

export default class Checkbox extends ThemeableComponent {
  namespace = 'Checkbox'

  themeStyleKeys = [
    'style',
    'iconStyle',
    'activeStyle',
    'disabledStyle'
  ]

  static propTypes = {
    onPress: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    style: ViewPropTypes.style,
    hitSlop: PropTypes.object
  }

  _getAccessibilityTraits () {
    const {
      checked
    } = this.props
    if (checked) {
      return 'selected'
    }
  }

  _getAccessibilityTraitsAndroid () {
    const {
      checked
    } = this.props
    if (checked) {
      return 'radiobutton_checked'
    } else {
      return 'radiobutton_unchecked'
    }
  }

  render () {
    const {
      checked,
      disabled,

      style,
      iconStyle,
      activeStyle,
      disabledStyle
    } = this.getComponentTheme()
    return <TouchableWithoutFeedback
      hitSlop={this.props.hitSlop}
      onPress={this.props.onPress}
      disabled={this.props.disabled}
      accessibilityTraits={this._getAccessibilityTraits()}
      accessibilityComponentType={this._getAccessibilityTraitsAndroid()}
      accessibilityLabel={this.props.label}
    >
      <View style={[style, checked ? activeStyle : {}, disabled ? disabledStyle : {}]}>
        {checked ? <Image
          style={iconStyle}
          source={require('./images/checked_simple.png')}
        /> : null}
      </View>
    </TouchableWithoutFeedback>
  };
}
