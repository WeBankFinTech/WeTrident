'use strict'

/**
 * Created by vengeanliu on 17/3/6.
 */
import PropTypes from 'prop-types'
import _ from 'lodash'
import React, { Component } from 'react'
import { Image, View, ViewPropTypes } from 'react-native'

export default class Icon extends Component {
  static propTypes = {
    source: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
    size: PropTypes.number,

    style: ViewPropTypes.style,
    iconStyle: ViewPropTypes.style,
  }

  render () {
    const restProps = _.pick(this.props, 'resizeMode')
    const {
      source,
      size
    } = this.props
    if (!src) {
      // console.warn(this.props.name + ' is a invalid icon')
      return null
    }

    return (
      <View
        // hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        style={this.props.style}>
        <Image
          style={[{ width: size, height: size }, this.props.iconStyle]}
          source={source}
          {...restProps}
        />
      </View>
    )
  }
}

