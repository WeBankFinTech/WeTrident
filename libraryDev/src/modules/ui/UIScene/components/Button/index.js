import React from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import ThemeableComponent from '@webank/trident/trident-ui/theme/ThemeableComponent'

export default class Button extends ThemeableComponent {
  // must defined for custom theme
  namespace = 'Button'

  static contextTypes = {
    theme: PropTypes.object.isRequired
  }

  render () {
    const {
      textColor,
      backgroundColor
    } = this.getComponentTheme()

    return <View style={{
      width: 100,
      height: 100,
      backgroundColor
    }} >
      <Text style={{
        color: textColor
      }}>这是个按钮</Text>
    </View>
  }
}
