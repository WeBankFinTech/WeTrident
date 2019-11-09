import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text
} from 'react-native'
import { ProUI } from '../values'
import {Row, Column} from '../Layout/Layout'
import Icon from '../Icon/Icon'
import WeTouchable from '../Button/lib/WeTouchable'

export default class List extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      // item name, 可以省略
      name: PropTypes.string,
      // item内容，可以是任何可以渲染的节点
      content: PropTypes.string.isRequired,
      // 表示item是否可以点击进行交互
      onPress: PropTypes.func,
      itemNameTextStyle: PropTypes.any,
      itemContentTextStyle: PropTypes.any
    })).isRequired,
    itemViewStyle: PropTypes.any,
    itemNameTextStyle: PropTypes.any,
    itemContentTextStyle: PropTypes.any,
    itemSeparator: PropTypes.node
  }
  static defaultProps = {
    itemSeparator: <View style={{width: '100%', height: ProUI.realOnePixel, backgroundColor: ProUI.color.border}} />
  }

  _renderRightArrow (item) {
    return item.onPress ? <Icon style={{paddingLeft: 5}} name={'right_arrow'} /> : null
  }

  _renderItem = (item, index) => {
    const {
      itemViewStyle,
      itemSeparator,
      itemNameTextStyle,
      itemContentTextStyle
    } = this.props
    const key = item.key === undefined ? index : item.key

    let itemEle
    if (item.name === undefined) {
      itemEle = (
        <Row.MainSpaceBetween.CrossCenter style={itemViewStyle}>
          <Text style={[{flex: 1, paddingRight: 10}, itemContentTextStyle, item.itemContentTextStyle]}>{item.content}</Text>
          {this._renderRightArrow(item)}
        </Row.MainSpaceBetween.CrossCenter>
      )
    } else {
      itemEle = (
        <Row.MainSpaceBetween.CrossCenter style={itemViewStyle}>
          <Text style={[{paddingRight: 10}, itemNameTextStyle, item.itemNameTextStyle]}>{item.name}</Text>
          <Row.CrossCenter style={{flex: 1}}>
            <Text numberOfLines={1} style={[{flex: 1, textAlign: 'right'}, itemContentTextStyle, item.itemContentTextStyle]}>{item.content}</Text>
            {this._renderRightArrow(item)}
          </Row.CrossCenter>
        </Row.MainSpaceBetween.CrossCenter>
      )
    }

    if (item.onPress) {
      itemEle = <WeTouchable key={key} onPress={item.onPress}>{itemEle}</WeTouchable>
    } else {
      itemEle = <View key={key}>{itemEle}</View>
    }

    if (index > 0) {
      itemEle = <View key={key}>
        {itemSeparator}
        {itemEle}
      </View>
    }

    return itemEle
  }

  render () {
    const {
      data
    } = this.props

    return (
      <Column>
        {data.map((item, index) => {
          return this._renderItem(item, index)
        })}
      </Column>
    )
  }
}
