/**
 * 单行列表项，常用于配置项，形式为[icon]text......[text|loading][icon]
 *
 * @created Lemorili
 */

import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'

import Indicator from '../loading/Indicator'
import { ProUI } from '../values'
import Icon from '../icon/Icon'

/*
 * props属性中：
 * label和status可自定义
 * iconStyle应做到统一风格
*/
export default class DefaultListItem extends Component {
  static propTypes = {
    data: PropTypes.shape({
      // 左侧图标（可选）
      icon: PropTypes.string,
      // 左侧文字（必须）
      label: PropTypes.string,
      // 右侧状态文案（可选）
      status: PropTypes.string,
      // 右侧的状态说明（可选）
      subStatus: PropTypes.string,
      // 是否显示右侧状态栏的提示小红点（可选）
      showHintDot: PropTypes.bool,
      // hintDot 参数
      hintDotProps: PropTypes.object,
      // 是否显示loading状态（可选，优先级高于status文本）
      loading: PropTypes.bool,
      // 右侧图标（可选，默认为箭头，如不想显示需设为null）
      iconRight: PropTypes.string,
      // 自定义右边内容
      renderRight: PropTypes.func
    }),
    index: PropTypes.number,
    iconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    labelStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
    statusStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    subStatusStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    rightStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    hintDotStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    renderLabel: PropTypes.func // 自定义左侧标题栏
  }

  render () {
    const {data, iconStyle, style, labelStyle, statusStyle, rightStyle, hintDotStyle, subStatusStyle} = this.props
    const iconRight = data.iconRight !== null ? (data.iconRight || 'forward') : null

    return (
      <View style={[styles.item, style]}>
        <View style={styles.piece}>
          {!!data.icon && <Icon name={data.icon} style={[styles.icon, iconStyle]} />}
          {this.props.renderLabel ? this.props.renderLabel() : <Text style={[styles.label, labelStyle]}>{data.label}</Text>}
        </View>

        {data.renderRight
          ? data.renderRight()
          : <View>
            <View style={[styles.piece, rightStyle]}>
              {
                data.loading ? <Indicator style={iconRight ? styles.mr10 : null} />
                  : data.status ? <Text style={[styles.status, iconRight ? styles.mr10 : null, statusStyle]}>{data.status}</Text>
                  : null
              }
              {
                iconRight ? <Icon name={iconRight} /> : null
              }
            </View>
            {data.subStatus ? <Text style={[styles.subStatus, subStatusStyle]}>{data.subStatus}</Text> : null}
          </View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ProUI.spaceY.medium,
    paddingHorizontal: ProUI.spaceX.large,
    minHeight: ProUI.fixedRowHeight
  },
  piece: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 30,
    marginRight: ProUI.spaceX.medium
  },
  label: {
    color: ProUI.color.primary,
    fontSize: ProUI.fontSize.medium
  },
  status: {
    color: ProUI.color.sub,
    fontSize: ProUI.fontSize.medium
  },
  subStatus: {
    fontSize: ProUI.fontSize.medium,
    color: ProUI.color.info,
    marginTop: ProUI.spaceY.small,
    textAlign: 'right'
  },
  mr10: {
    marginRight: ProUI.spaceX.medium
  }
})
