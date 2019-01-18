import { View } from 'react-native'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

export default class ContentSkeleton extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(['rectangle', 'circle']), // default rectangle
    width: PropTypes.number, // works on type rectangle only
    height: PropTypes.number, // works on type rectangle only
    diameter: PropTypes.number, // works on type circle only
    marginTop: PropTypes.number,
    marginRight: PropTypes.number,
    marginBottom: PropTypes.number,
    marginLeft: PropTypes.number,
    backgroundColor: PropTypes.string
  }

  static defaultProps = {
    mode: 'rectangle',
    width: 100,
    height: 18,
    diameter: 80,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    backgroundColor: '#FAFAFA'
  }

  extractStyle () {
    return _.pickBy(this.props, (v, k) => !_.includes(['mode', 'diameter'], k))
  }

  renderCircle () {
    const { diameter } = this.props
    const style = this.extractStyle()
    style.width = diameter
    style.height = diameter
    style.borderRadius = diameter / 2
    return <View style={style} />
  }

  renderRectangle () {
    const style = this.extractStyle()
    return <View style={style} />
  }

  render () {
    const { mode } = this.props
    let _render
    switch (mode) {
      case 'rectangle':
        _render = this.renderRectangle
        break
      case 'circle':
        _render = this.renderCircle
        break
      default:
        _render = this.renderRectangle
        break
    }

    return _render.bind(this)()
  }
}
