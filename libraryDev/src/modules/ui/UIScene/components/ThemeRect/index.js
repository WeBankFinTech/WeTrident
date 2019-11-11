import React from 'react'
import { Text } from 'react-native'
import ThemeableComponent from '@webank/trident/trident-ui/theme/ThemeableComponent'
import { Row } from '@webank/trident/trident-ui/Layout/Layout'

/**
 * 用于演示主题的使用，其他需要支持主题切换的组件可以使用这一套模式
 */
export default class Button extends ThemeableComponent {
  // must defined for custom theme
  namespace = 'Button'

  render () {
    const { textColor, backgroundColor } = this.getComponentTheme()

    return <Row.MainCenter.CrossCenter style={{ height: 40, backgroundColor }}>
      <Text style={{ color: textColor }}>Some Text in ThemeRect</Text>
    </Row.MainCenter.CrossCenter>
  }
}
