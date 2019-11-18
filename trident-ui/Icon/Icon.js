import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Image, View} from 'react-native'
import IconNames from './IconNames'
import {iconNamePropType} from '../propTypeUtils'

export default class Icon extends Component {
  static Names = IconNames
  static propTypes = {
    name: iconNamePropType.isRequired,
    style: PropTypes.any,

    // 响应式
    // Icon的宽度，如果height没有设置，则根据icon的原始比例进行缩放设置
    width: PropTypes.number,
    // Icon的高端，如果width没有设置，则根据icon的原始比例进行缩放设置
    height: PropTypes.number
  }

  _getSizeInfo (src) {
    const {
      width,
      height
    } = this.props

    if (width === undefined && height === undefined) {
      return {
        width: src.width,
        height: src.height
      }
    } else if (width === undefined) {
      return {
        width: height * (src.width / src.height),
        height: height
      }
    } else if (height === undefined) {
      return {
        width: width,
        height: width * (src.height / src.width)
      }
    } else {
      return {
        width: width,
        height: height
      }
    }
  }

  render () {
    const {
      name,
      style
    } = this.props

    const src = name
    const size = this._getSizeInfo(src)
    return (
      <View style={style}>
        <Image
          style={{width: size.width, height: size.height}}
          source={src.uri}
        />
      </View>
    )
  }
}
