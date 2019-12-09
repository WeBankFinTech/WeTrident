import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import { ProUI } from '../../values'
import ThemeableComponent from '../../theme/ThemeableComponent'

const oneStyleType = PropTypes.oneOfType([PropTypes.object, PropTypes.number])
const styleType = PropTypes.oneOfType([oneStyleType, PropTypes.arrayOf(oneStyleType)])

class Tr extends ThemeableComponent {
  namespace = 'Table.Tr'
  themeStyleKeys = ['style', 'textStyle']

  static propTypes = {
    style: styleType
  }
  static childContextTypes = {
    textStyle: PropTypes.style,
    borderStyle: PropTypes.style
  }

  getChildContext () {
    const {
      textStyle,
    } = this.props

    return {
      textStyle,
    }
  }

  render () {
    const {
      children,

      style,
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

    textStyle: styleType
  }
  static contextTypes = {
    textStyle: PropTypes.style,
    borderStyle: PropTypes.style
  }

  static defaultProps = {
    row: 1,
    align: 'left'
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
    align: PropTypes.string,
    textStyle: styleType
  }

  render () {
    const {
      children,
      row,

      // move to style
      align,
      textStyle,
    } = this.getComponentTheme()
    return (
      <Td row={row} align={align}
          textStyle={[{ color: ProUI.color.sub, fontWeight: 'bold' }, textStyle]}>{children}</Td>
    )
  }
}

export default class Table extends ThemeableComponent {
  namespace = 'Table'
  themeStyleKeys = ['style', 'textStyle']

  static Tr = Tr
  static Th = Th
  static Td = Td

  static propTypes = {
    style: PropTypes.style,

    // context
    borderStyle: PropTypes.style,
    textStyle: Text.propTypes.style
  }

  static defaultProps = {}

  static childContextTypes = {
    textStyle: Text.propTypes.style,
    borderStyle: PropTypes.style,
  }

  // 为下层组件提供感知当前上下文的能力
  getChildContext () {
    const {
      textStyle,
      borderStyle,
    } = this.props

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

const styles = StyleSheet.create({
  defaultCellStyle: {},
  defaultTextStyle: {
    lineHeight: ProUI.lineHeight.medium,
    backgroundColor: ProUI.color.moduleBackground
  }
})
