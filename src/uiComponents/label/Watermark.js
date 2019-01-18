'use strict'
import {
  View,
  PixelRatio,
  StyleSheet,
  Text
} from 'react-native'
import Svg, {
  Circle
} from 'react-native-svg'

import React, {Component} from 'react'
const borderWidth = 1 / PixelRatio.get()
import PropTypes from 'prop-types'

export default class Watermark extends Component {
  static propTypes = {
    strokeColor: PropTypes.string,
    textStyle: PropTypes.object,
    textContent: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  }

  _renderTextItems () {
    const {
      textContent,
      textStyle
    } = this.props
    if (textContent) {
      if (typeof textContent === 'string') {
        return <Text style={[styles.text, textStyle]}>{textContent}</Text>
      } else if (Array.isArray(textContent)) {
        return textContent.map((item, i) => {
          return <Text key={'wat_' + i} style={[styles.text, textStyle]}>{item}</Text>
        })
      }
    }

    return null
  }

  render () {
    const {
      strokeColor = '#f4907b'
    } = this.props

    return (
      <View style={[this.props.style, {width: 48, height: 48, overflow: 'hidden'}]}>
        <Svg width='60' height='60'>
          <Circle cx='30' cy='30' r={30 - borderWidth} stroke={strokeColor} strokeWidth={borderWidth} fill='none' />
          <Circle cx='30' cy='30' r={27} stroke={strokeColor} strokeWidth={borderWidth} fill='none' strokeDasharray='1,1' />
          <Circle cx='30' cy='30' r={24} stroke={strokeColor} strokeWidth={borderWidth} fill='none' strokeDasharray='60,24' strokeDashoffset='-85' />
        </Svg>
        <View style={{
          position: 'absolute',
          top: 5,
          left: 0,
          width: 60,
          height: 60,
          paddingBottom: 8,
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          transform: [{rotate: '-20deg'}, {scale: 0.85}]
        }}>
          { this._renderTextItems() }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    lineHeight: 12,
    color: '#f4907b',
    textAlign: 'center'
  }
})
