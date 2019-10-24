'use strict'

/**
 * Created by vengeanliu on 17/3/6.
 */
import PropTypes from 'prop-types'
import _ from 'lodash'
import React, {Component} from 'react'
import {Image, View, ViewPropTypes} from 'react-native'

export default class Icon extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    iconStyle: ViewPropTypes.style,
    name: PropTypes.string
  }
  render () {
    const restProps = _.pick(this.props, 'resizeMode')

    const src = sources[this.props.name]
    if (!src) {
      // console.warn(this.props.name + ' is a invalid icon')
      return null
    }

    return (
      <View
        // hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        style={this.props.style}>
        <Image
          style={[{width: src.width, height: src.height}, this.props.iconStyle]}
          source={src.uri}
          {...restProps}
        />
      </View>
    )
  }
}

const sources = {
}
