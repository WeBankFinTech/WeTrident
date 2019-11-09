import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Image, View} from 'react-native'

export default class Icon extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    style: PropTypes.any
  }
  render () {
    const {
      name,
      style
    } = this.props

    const src = sources[name]
    return (
      <View style={style}>
        <Image
          style={{width: src.width, height: src.height}}
          source={src.uri}
        />
      </View>
    )
  }
}

const sources = {
  right_arrow: {get uri () { return require('./images/arrow_bold.png') }, width: 8.5, height: 13},
  clear: {get uri () { return require('./images/clear_btn.png') }, width: 20, height: 20},
}
