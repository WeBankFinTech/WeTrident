import React from 'react'
import {
  View,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import ThemeableComponent from '../../theme/ThemeableComponent'
import WePropTypes from '../../utils/WePropTypes'

const oneStyleType = PropTypes.oneOfType([PropTypes.object, PropTypes.number])
const styleType = PropTypes.oneOfType([oneStyleType, PropTypes.arrayOf(oneStyleType)])

class Tr extends ThemeableComponent {
  namespace = 'Table.Tr'

  themeStyleKeys = ['style', 'textStyle']

  static propTypes = {
    style: styleType
  }

  static childContextTypes = {
    textStyle: WePropTypes.textPropTypesStyle,
    borderStyle: WePropTypes.viewPropTypesStyle
  }

  getChildContext () {
    const {
      textStyle
    } = this.props

    return {
      textStyle
    }
  }

  render () {
    const {
      children,

      style
    } = this.getComponentTheme()
    return (
      <View style={[style]}>
        {children}
      </View>
    )
  }
}

class Td extends ThemeableComponent {
  namespace = 'Table.Td'

  themeStyleKeys = ['style', 'textStyle', 'borderStyle']

  static propTypes = {
    row: PropTypes.number,

    textStyle: WePropTypes.textPropTypesStyle
  }

  static contextTypes = {
    textStyle: WePropTypes.textPropTypesStyle,
    borderStyle: WePropTypes.viewPropTypesStyle,

    theme: WePropTypes.object
  }

  static defaultProps = {
    row: 1
  }

  render () {
    const {
      children,
      row,

      style,
      textStyle,
      borderStyle
    } = this.getComponentTheme()

    return (
      <View style={[style, borderStyle, { flex: row }]}>
        <Text style={[textStyle]}>{children}</Text>
      </View>
    )
  }
}

class Th extends ThemeableComponent {
  namespace = 'Table.Th'

  themeStyleKeys = ['style', 'textStyle']

  static propTypes = {
    row: PropTypes.number,
    textStyle: WePropTypes.textPropTypesStyle
  }

  render () {
    const {
      children,
      row,

      // move to style
      textStyle
    } = this.getComponentTheme()
    return (
      <Td
        row={row}
        textStyle={[textStyle]}
      >{children}
      </Td>
    )
  }
}

export default class Table extends ThemeableComponent {
  namespace = 'Table'

  themeStyleKeys = ['style', 'textStyle', 'borderStyle']

  static Tr = Tr

  static Th = Th

  static Td = Td

  static propTypes = {
    style: WePropTypes.viewPropTypesStyle,

    // context
    borderStyle: WePropTypes.viewPropTypesStyle,
    textStyle: WePropTypes.textPropTypesStyle
  }

  static defaultProps = {}

  static childContextTypes = {
    textStyle: WePropTypes.textPropTypesStyle,
    borderStyle: WePropTypes.viewPropTypesStyle
  }

  // 为下层组件提供感知当前上下文的能力
  getChildContext () {
    const {
      textStyle,
      borderStyle
    } = this.getComponentTheme()

    return {
      borderStyle,
      textStyle
    }
  }

  render () {
    const {
      children,

      style,
      borderStyle
    } = this.getComponentTheme()

    return (
      <View style={[style, borderStyle]}>
        {children}
      </View>
    )
  }
}
