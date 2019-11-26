import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import { ProUI } from '../../values'

const oneStyleType = PropTypes.oneOfType([PropTypes.object, PropTypes.number])
const styleType = PropTypes.oneOfType([oneStyleType, PropTypes.arrayOf(oneStyleType)])

class Tr extends React.Component {
  static propTypes = {
    style: styleType
  }

  render () {
    const {
      children,
      style
    } = this.props
    return (
      <View style={[styles.defaultRowStyle, style]}>
        {children}
      </View>
    )
  }
}

class Td extends React.Component {
  static propTypes = {
    row: PropTypes.number,
    align: PropTypes.string,
    textStyle: styleType
  }
  static contextTypes = {
    borderColor: PropTypes.string,
    borderWidth: PropTypes.number,
    color: PropTypes.string,
    align: PropTypes.string,
    fontSize: PropTypes.number
  }

  static defaultProps = {
    row: 1,
    align: 'left'
  }

  render () {
    const {
      children,
      row,
      textStyle
    } = this.props
    const {
      borderColor,
      borderWidth,
      color,
      align,
      fontSize
    } = this.context

    return (
      <View style={[styles.defaultCellStyle, {
        flex: row,
        borderColor: borderColor,
        borderRightWidth: borderWidth,
        borderBottomWidth: borderWidth
      }]}>
        <Text style={[styles.defaultTextStyle, {textAlign: align, color: color, fontSize: fontSize}, textStyle]}>{children}</Text>
      </View>
    )
  }
}

class Th extends React.Component {
  static propTypes = {
    row: PropTypes.number,
    align: PropTypes.string,
    textStyle: styleType
  }
  render () {
    const {
      children,
      row,
      align,
      textStyle
    } = this.props
    return (
      <Td row={row} align={align} textStyle={[{color: ProUI.color.sub, fontWeight: 'bold'}, textStyle]}>{children}</Td>
    )
  }
}

export default class Table extends React.Component {
  static propTypes = {
    style: PropTypes.any,
    borderColor: PropTypes.string,
    color: PropTypes.string,
    borderWidth: PropTypes.number,
    align: PropTypes.string,
    fontSize: PropTypes.number,
    backgroundColor: PropTypes.string
  }

  static defaultProps = {
    borderColor: ProUI.color.border,
    borderWidth: 0.5,
    color: ProUI.color.primary,
    fontSize: ProUI.fontSize.small,
    align: 'left',
    ratio: 1,
    backgroundColor: ProUI.color.moduleBackground
  }

  static childContextTypes = {
    borderColor: PropTypes.string,
    borderWidth: PropTypes.number,
    color: PropTypes.string,
    align: PropTypes.string,
    fontSize: PropTypes.number
  }
  static Tr = Tr
  static Th = Th
  static Td = Td

  // 为下层组件提供感知当前上下文的能力
  getChildContext () {
    const {
      borderColor,
      borderWidth,
      color,
      align,
      fontSize
    } = this.props

    return {
      borderColor,
      borderWidth,
      color,
      align,
      fontSize
    }
  }

  render () {
    const {
      borderColor,
      borderWidth,
      style,
      children,
      backgroundColor
    } = this.props
    return (
      <View style={[style, {
        borderColor: borderColor,
        borderLeftWidth: borderWidth,
        borderTopWidth: borderWidth,
        backgroundColor: backgroundColor
      }]}>
        {children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  defaultRowStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: ProUI.color.moduleBackground
  },
  defaultCellStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: ProUI.color.moduleBackground
  },
  defaultTextStyle: {
    lineHeight: ProUI.lineHeight.medium,
    backgroundColor: ProUI.color.moduleBackground
  }
})
