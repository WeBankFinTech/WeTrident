/**
 * Created by vengeanliu on 2017/7/6.
 */

import {
  View,
  PixelRatio
} from 'react-native'
import React, {Component} from 'react'
import WeTouchable from '../ext/WeTouchable'
import ListItem from './ListItem'
// import PropTypes from 'prop-types'

let SEPARATOR = 'we_list_separator'
let TOP_SEPARATOR = 'top'
let BOTTOM_SEPARATOR = 'bottom'

export default class List extends Component {
  // static propTypes = {
  //   // 分割线颜色
  //   lineColor: PropTypes.string,
  //   // 按压态颜色
  //   itemActiveColor: PropTypes.string,
  //   // 分割线渲染方法
  //   renderSeparator: PropTypes.func,
  //   // 扩展分割线样式
  //   separatorStyle: PropTypes.object,
  //   // 这里指的是渲染和分割线一样的上下边界，是为了解决按压态的问题，如果是有自己风格的列表外边线直接用style定义就好了
  //   renderBorder: PropTypes.bool,
  //   // 列表项数据，类同ListView
  //   dataSource: PropTypes.array,
  //   // 列表容器自定义样式
  //   style: PropTypes.object,
  //   // 列表项统一点击响应事件
  //   onItemPress: PropTypes.func,
  //   // 列表项自定义渲染方法，类同ListView
  //   onRenderRow: PropTypes.func
  // }

  constructor (props) {
    super(props)
    this._renderSeparator = this.props.renderSeparator ? this._renderCustomSeparator : this._renderSeparator.bind(this)
  }

  static defaultProps = {
    lineColor: '#e5e5e5'
  }

  _renderSeparator (key) {
    return (<View
      ref={SEPARATOR + key}
      style={[{
        backgroundColor: this.props.lineColor,
        height: 1 / PixelRatio.get(),
        marginLeft: 25
      }, this.props.separatorStyle]}
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
    let topSeparator = this.refs[SEPARATOR + key]
    let bottomSeparator = this.refs[SEPARATOR + (parseInt(key) + 1)]
    if (this.props.renderBorder) {
      if (parseInt(key) === 0) {
        this.refs[SEPARATOR + TOP_SEPARATOR].setNativeProps({style: {opacity: 0}})
      }
      if (parseInt(key) === this.account - 1) {
        this.refs[SEPARATOR + BOTTOM_SEPARATOR].setNativeProps({style: {opacity: 0}})
      }
    }
    if (topSeparator) {
      topSeparator.setNativeProps({style: {opacity: 0}})
    }
    if (bottomSeparator) {
      bottomSeparator.setNativeProps({style: {opacity: 0}})
    }
  }

  // 还原分割线
  _onItemPressOut (key) {
    let topSeparator = this.refs[SEPARATOR + key]
    let bottomSeparator = this.refs[SEPARATOR + (parseInt(key) + 1)]
    if (this.props.renderBorder) {
      if (parseInt(key) === 0) {
        this.refs[SEPARATOR + TOP_SEPARATOR].setNativeProps({style: {opacity: 1}})
      }
      if (parseInt(key) === this.account - 1) {
        this.refs[SEPARATOR + BOTTOM_SEPARATOR].setNativeProps({style: {opacity: 1}})
      }
    }
    if (topSeparator) {
      topSeparator.setNativeProps({style: {opacity: 1}})
    }
    if (bottomSeparator) {
      bottomSeparator.setNativeProps({style: {opacity: 1}})
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

  _renderRowByData () {
    let {dataSource, style, onRenderRow, onItemPress = () => {}} = this.props

    if (onRenderRow) {
      return (
        <View style={style}>
          {this.props.renderBorder && this._renderSeparator(TOP_SEPARATOR)}
          {dataSource.map((item, index) => (
            <View key={index}>
              {index > 0 && this._renderSeparator(index)}
              {this._renderChild(onRenderRow(item, index), index)}
            </View>
          ))}
          {this.props.renderBorder && this._renderSeparator(BOTTOM_SEPARATOR)}
        </View>
      )
    }

    return (
      <View style={style}>
        {this.props.renderBorder && this._renderSeparator(TOP_SEPARATOR)}
        {dataSource.map((item, index) => (
          <View key={index}>
            {index > 0 && this._renderSeparator(index)}
            <WeTouchable
              activeColor={this.props.itemActiveColor}
              pressMode='highlight'
              onPressIn={
                () => {
                  this._onItemPressIn(index)
                }
              }
              onPressOut={
                () => {
                  this._onItemPressOut(index)
                }
              }
              onPress={
                () => {
                  let onPress = item.onPress || onItemPress
                  onPress(item, index)
                }}>
              <ListItem
                key={index}
                index={index}
                data={item} />
            </WeTouchable>
          </View>
        ))}
        {this.props.renderBorder && this._renderSeparator(BOTTOM_SEPARATOR)}
      </View>
    )
  }

  _renderRowByChildren () {
    // 这段变量声明不能放到constructor里面去，否则有一些动态渲染的列表无法刷新列表项
    let {children} = this.props
    let childrenArray = React.Children.toArray(children)
    this.account = childrenArray.length
    this.renderItems = []

    for (let i in childrenArray) {
      let child = childrenArray[i]
      if (i > 0) {
        this.renderItems.push(this._renderSeparator(i))
      }
      this.renderItems.push(this._renderChild(child, i))
    }

    return (
      <View style={this.props.style}>
        {this.props.renderBorder && this._renderSeparator(TOP_SEPARATOR)}
        {this.renderItems}
        {this.props.renderBorder && this._renderSeparator(BOTTOM_SEPARATOR)}
      </View>
    )
  }

  render () {
    if (this.props.dataSource) {
      return this._renderRowByData()
    }

    if (this.props.children) {
      return this._renderRowByChildren()
    }

    return <View style={this.props.style} />
  }
}
