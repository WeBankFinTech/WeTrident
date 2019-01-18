/**
 * Created by yatesmiao on 2017/7/25.
 */

import PropTypes from 'prop-types'

import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'

export default class WeText extends Component {
  static propTypes = {
    fontStyle: PropTypes.number
  }
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    const propsWithoutStyle = {...this.props, style: this.props.fontStyle}
    console.log(propsWithoutStyle)
    console.log(this.props)
    return (
      <View style={[{justifyContent: 'center', alignItems: 'center'}, this.props.style]}>
        <Text {...propsWithoutStyle}>
          {this.props.children}
        </Text>
      </View>
    )
  }
}
