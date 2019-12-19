/**
 * Created by vengeanliu on 2017/7/6.
 */

import {
  View,
  ViewPropTypes,
  Text
} from 'react-native'
import PropTypes from 'prop-types'

import React from 'react'
import Item from './Item'
import { ProUI } from '../../values'
import WeTouchable from '../../lib/WeTouchable'
import ThemeableComponent from '../../theme/ThemeableComponent'

const SEPARATOR = 'we_list_separator'
const TOP_SEPARATOR = 'top'
const BOTTOM_SEPARATOR = 'bottom'

class Index extends ThemeableComponent {
  namespace = 'List'

  themeStyleKeys = ['style', 'separatorStyle']

  static Item = Item

  static propTypes = {
    // 分割线颜色
    lineColor: PropTypes.string,
    // 按压态颜色
    itemActiveColor: PropTypes.string,
    // 分割线渲染方法
    renderSeparator: PropTypes.func,
    // 扩展分割线样式
    separatorStyle: ViewPropTypes.style,
    // 这里指的是渲染和分割线一样的上下边界，是为了解决按压态的问题，如果是有自己风格的列表外边线直接用style定义就好了
    renderBorder: PropTypes.bool,
    // 列表项数据，类同ListView
    dataSource: PropTypes.array,
    // 列表容器自定义样式
    style: ViewPropTypes.style,
    // 列表项统一点击响应事件
    onItemPress: PropTypes.func,
    // 列表项自定义渲染方法，类同ListView
    onRenderRow: PropTypes.func
  }

  constructor (props) {
    super(props)
    this._renderSeparator = this.props.renderSeparator ? this._renderCustomSeparator : this._renderSeparator.bind(this)
  }

  static defaultProps = {
    lineColor: ProUI.color.border
  }

  _renderSeparator (key) {
    const {
      separatorStyle
    } = this.getComponentTheme()
    return (<View
      ref={SEPARATOR + key}
      style={[separatorStyle]}
      key={SEPARATOR + key}
    />)
  }

  // 给自定义线加上ref
  _renderCustomSeparator (key) {
    return React.cloneElement(this.props.renderSeparator(), {
      ref: SEPARATOR + key,
      key: SEPARATOR + key
    })
  }

  // 这里需要处理列表按压态时，改变线的样式，以达到按压态是一个整体的概念
  _onItemPressIn (key) {
    const topSeparator = this.refs[SEPARATOR + key]
    const bottomSeparator = this.refs[SEPARATOR + (parseInt(key) + 1)]
    if (this.props.renderBorder) {
      if (parseInt(key) === 0) {
        this.refs[SEPARATOR + TOP_SEPARATOR].setNativeProps({ style: { opacity: 0 } })
      }
      if (parseInt(key) === this.account - 1) {
        this.refs[SEPARATOR + BOTTOM_SEPARATOR].setNativeProps({ style: { opacity: 0 } })
      }
    }
    if (topSeparator) {
      topSeparator.setNativeProps({ style: { opacity: 0 } })
    }
    if (bottomSeparator) {
      bottomSeparator.setNativeProps({ style: { opacity: 0 } })
    }
  }

  // 还原分割线
  _onItemPressOut (key) {
    const topSeparator = this.refs[SEPARATOR + key]
    const bottomSeparator = this.refs[SEPARATOR + (parseInt(key) + 1)]
    if (this.props.renderBorder) {
      if (parseInt(key) === 0) {
        this.refs[SEPARATOR + TOP_SEPARATOR].setNativeProps({ style: { opacity: 1 } })
      }
      if (parseInt(key) === this.account - 1) {
        this.refs[SEPARATOR + BOTTOM_SEPARATOR].setNativeProps({ style: { opacity: 1 } })
      }
    }
    if (topSeparator) {
      topSeparator.setNativeProps({ style: { opacity: 1 } })
    }
    if (bottomSeparator) {
      bottomSeparator.setNativeProps({ style: { opacity: 1 } })
    }
  }

  _renderChild (child, index) {
    return child.props.pressMode === WeTouchable.pressMode.highlight ? React.cloneElement(
      child,
      {
        onPressIn: () => {
          this._onItemPressIn(index)
          if (child.props.onPressIn) {
            child.props.onPressIn()
          }
        },
        onPressOut: () => {
          this._onItemPressOut(index)
          if (child.props.onPressOut) {
            child.props.onPressOut()
          }
        }
      }
    ) : child
  }

  _renderRowByChildren () {
    // 这段变量声明不能放到constructor里面去，否则有一些动态渲染的列表无法刷新列表项
    const { children } = this.props
    const childrenArray = React.Children.toArray(children)
    this.account = childrenArray.length
    this.renderItems = []

    for (const i in childrenArray) {
      const child = childrenArray[i]
      if (i > 0) {
        this.renderItems.push(this._renderSeparator(i))
      }
      this.renderItems.push(this._renderChild(child, i))
    }

    const {
      style
    } = this.getComponentTheme()

    return (
      <View style={[style, this.props.style]}>
        {this.props.renderBorder && this._renderSeparator(TOP_SEPARATOR)}
        {this.renderItems}
        {this.props.renderBorder && this._renderSeparator(BOTTOM_SEPARATOR)}
      </View>
    )
  }

  render () {
    if (this.props.children) {
      return this._renderRowByChildren()
    }

    return <View style={this.props.style} />
  }
}

class Row extends ThemeableComponent {
  namespace = 'List.Row'

  static propTypes = {
    // 模式1， 简单纯文字，直接提供sting即可, 优先级别最低
    label: PropTypes.string,
    value: PropTypes.string,

    // 模式2， KV模式支持分别自定义渲染, 优先级次
    renderLabel: PropTypes.func,
    renderValue: PropTypes.func,

    // 模式3，整行自定义渲染, 优先级最高
    renderRow: PropTypes.func
  }

  render () {
    const {
      normalText,
      primaryText,
      rowStyle
    } = this.getComponentTheme()
    if (this.props.renderRow) {
      return <View style={rowStyle}>
        {this.props.renderRow()}
      </View>
    } else {
      return <View style={rowStyle}>
        {this.props.renderLabel ? this.props.renderLabel() : <Text style={normalText}>{this.props.label}</Text>}
        {this.props.renderValue ? this.props.renderValue() : <Text style={primaryText}>{this.props.value}</Text>}
      </View>
    }
  }
}

Index.Row = Row
export default Index
