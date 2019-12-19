'use strict'
/**
 * Created by williamdeng on 2019/8/27.
 */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { View, PixelRatio } from 'react-native'
import SceneTraversal from './SceneTraversal'

export default class ElementMark extends Component {
  static propTypes = {
    name: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <View
        style={[{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderRadius: 5,
          borderWidth: 0,
          borderColor: '#E26B53',
          borderStyle: 'dashed'
        }, this.state.style || {}]} ref={_ref => { SceneTraversal.setRef(_ref) }}
      />
    )
  }

  setMarkPosition (x = 0, y = 0, width = 0, height = 0) {
    this.setState({
      style: {
        left: x,
        top: y,
        width,
        height,
        borderWidth: width === 0 && height === 0 ? 0 : 5 / PixelRatio.get()
      }
    })
  }
}
