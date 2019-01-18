/**
 * Created by vengeanliu on 17/2/27.
 */

import { View, Image } from 'react-native'

import React, {Component} from 'react'
import Icon from '../icon/Icon'
import PropTypes from 'prop-types'
import WeTouchable from '../ext/WeTouchable'

export default class NavImageButton extends Component {
  static propTypes = {
    /**
     * 图标类型
     * 取值为'custom'时，读取 source 属性来设置图标（该属性与<Image>组件的source属性取值相同），这是默认取值
     * 同时也支持取值为 <Icon> 组件中的预设的图标名称，具体参考 {@link Icon} 中的 name 属性取值
     */
    type: PropTypes.string,
    source: PropTypes.object,
    onPress: PropTypes.func
  }

  static defaultProps = {
    type: 'custom',
    source: null,
    onPress: () => {}
  }

  render () {
    const {type, onPress, source} = this.props

    return (
      <WeTouchable onPress={onPress}>
        <View
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
          {type === 'custom'
            ? (<Image
              style={{ height: 22, width: 22 }}
              source={source}
              resizeMode={'contain'}
            />)
            : (<Icon name={type} />)
          }
        </View>
      </WeTouchable>
    )
  }
}
