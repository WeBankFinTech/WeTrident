
import {
  Image,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes
} from 'react-native'
import PropTypes from 'prop-types'

import React, {Component} from 'react'
import { ProUI } from '../../values'

export default class Checkbox extends Component {
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
    return <TouchableWithoutFeedback
      hitSlop={this.props.hitSlop}
      onPress={this.props.onPress}
      disabled={this.props.disabled}
      accessibilityTraits={this._getAccessibilityTraits()}
      accessibilityComponentType={this._getAccessibilityTraitsAndroid()}
      accessibilityLabel={this.props.label}
    >
      <View style={[{
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: this.props.disabled ? ProUI.color.border : 'transparent'
      }, this.props.style]}>
        <Image
          style={{width: 18, height: 18, resizeMode: 'contain'}}
          source={this.props.checked ? require('./images/checked.png') : require('./images/normal.png')}
        />
      </View>
    </TouchableWithoutFeedback>
  };
}
