/**
 * 单行列表项，常用于配置项，形式为[icon]text......[text|loading][icon]
 *
 * @created Lemorili
 */

'use strict'
import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import Indicator from '../loading/Indicator'
import { WeUI } from '../theme'
import {Icon} from '../../apps/webankPro/bizComponents'

/*
 * props属性中：
 * data的结构为`{
    icon: 左侧图标（可选）
    label: 左侧文字（必须）
    status: 右侧状态文案（可选）
    loading: 是否显示loading状态（可选，优先级高于status文本）
    iconRight: 右侧图标（可选，默认为箭头，如不想显示需设为null）
    ...其它自定义内容
  }`
 * label和status固定样式，不可改
 * iconStyle应做到统一风格
*/
export default class ListItem extends Component {
  render () {
    const {data, iconStyle, style} = this.props
    const iconRight = data.iconRight !== null ? (data.iconRight || 'forward') : null

    return (
      <View style={[styles.item, style]}>
        <View style={styles.piece}>
          {!!data.icon && <Icon name={data.icon} style={[styles.icon, iconStyle]} />}
          <Text style={styles.label}>{data.label}</Text>
        </View>

        <View style={styles.piece}>
          {
            data.loading ? <Indicator style={iconRight ? styles.mr10 : null} />
              : data.status ? <Text style={[styles.status, iconRight ? styles.mr10 : null]}>{data.status}</Text>
              : null
          }
          {
            iconRight ? <Icon name={iconRight} /> : null
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 25
  },
  piece: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 30,
    marginRight: 15
  },
  label: {
    color: '#445c95',
    fontSize: 16
  },
  status: {
    color: WeUI.color.info,
    fontSize: WeUI.fontSize.medium
  },
  mr10: {
    marginRight: 10
  }
})
