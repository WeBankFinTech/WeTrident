/**
 * 单行列表项，常用于配置项，形式为[icon]text......[text|loading][icon]
 *
 * @created Lemorili
 */

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import Indicator from './Indicator'
import { ProUI } from '../../values'
import Icon from '../icon/Icon'
import { iconNamePropType } from '../../propTypeUtils'
import WeTouchable from '../../lib/WeTouchable'
import ThemeableComponent from '../../theme/ThemeableComponent'

/*
 * props属性中：
 * label和status可自定义
 * iconStyle应做到统一风格
*/
export default class Item extends ThemeableComponent {
  namespace = 'List.Item'

  themeStyleKeys = [
    'style',
    'iconStyle',
    'labelStyle',
    'statusStyle',
    'rightStyle',
    'subStatusStyle'
  ]

  static propTypes = {
    data: PropTypes.shape({
      // 左侧图标（可选）
      icon: iconNamePropType,
      label: PropTypes.string.isRequired,
      // 右侧状态文案（可选）
      status: PropTypes.string,
      // 右侧的状态说明（可选）
      subStatus: PropTypes.string,
      // hintDot 参数
      hintDotProps: PropTypes.object,
      // 是否显示loading状态（可选，优先级高于status文本）
      loading: PropTypes.bool,
      // 右侧图标（可选，默认为箭头，如不想显示需设为null）
      iconRight: iconNamePropType,
      // 自定义右边内容
      renderRight: PropTypes.func,
      // 可选，如果设置了，这表示item可以点击
      onPress: PropTypes.func
    }).isRequired,
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
    const {
      data,

      iconStyle,
      style,
      labelStyle,
      statusStyle,
      rightStyle,
      subStatusStyle
    } = this.getComponentTheme()
    const {
      onPress
    } = data

    const Wrapper = onPress ? WeTouchable : View

    return (
      <Wrapper style={[style]} onPress={onPress}>
        <View style={[rightStyle]}>
          {data.icon ? <Icon name={data.icon} style={[iconStyle]} /> : null}
          {this.props.renderLabel ? this.props.renderLabel() : <Text style={[labelStyle]}>{data.label}</Text>}
        </View>

        {data.renderRight
          ? data.renderRight()
          : <View>
            <View style={[rightStyle]}>
              {
                data.loading ? <Indicator style={data.iconRight ? styles.mr10 : null} />
                  : data.status ? <Text style={[data.iconRight ? styles.mr10 : null, statusStyle]}>{data.status}</Text>
                    : null
              }
              {
                data.iconRight ? <Icon name={data.iconRight} /> : null
              }
            </View>
            {data.subStatus ? <Text style={[subStatusStyle]}>{data.subStatus}</Text> : null}
          </View>}
      </Wrapper>
    )
  }
}

const styles = StyleSheet.create({
  mr10: {
    marginRight: ProUI.spaceX.medium
  }
})
