import React, { Component } from 'react'
import WeTouchableHighlight from './WeTouchableHighlight'
import WeTouchableOpacity from './WeTouchableOpacity'
import WeTouchableMask from './WeTouchableMask'
import PropTypes from './PropTypes'
import _ from 'lodash'

const keyMirror = require('fbjs/lib/keyMirror')
const PRESS_MODE = keyMirror({
  opacity: null,
  highlight: null,
  mask: null,
  none: null
})

class WeTouchable extends Component {
  static pressMode = PRESS_MODE
  static propTypes = {
    disabled: PropTypes.bool,
    activeOpacity: PropTypes.number,
    onPress: PropTypes.func.isRequired,
    backgroundColor: PropTypes.string,
    isEnabled: PropTypes.bool,
    pressMode: PropTypes.oneOf([
      PRESS_MODE.opacity,
      PRESS_MODE.highlight,
      PRESS_MODE.mask,
      PRESS_MODE.none
    ]),

    // highlight
    activeColor: PropTypes.string,
    activeType: PropTypes.string
  }

  static defaultProps = {
    isEnabled: true,
    rid: ''
  }
  static contextTypes = {
    moduleName: PropTypes.string,
    sceneName: PropTypes.string
  }

  constructor () {
    super(...arguments)
    this.isEnabled = this.props.isEnabled
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.isEnabled !== this.props.isEnabled) {
      return true
    } else {
      // console.log('WeTouchable shouldComponentUpdate ' + this.props.rid, nextProps, this.props, !_.isEqual(nextProps, this.props))
      // console.log('WeTouchable shouldComponentUpdate ' + this.props.rid, 'children', nextProps, this.props.children, !_.isEqual(nextProps, this.props.children))
      // 只有children更新的时候才更新
      return nextProps.disabled !== this.props.disabled || !_.isEqual(nextProps.children, this.props.children)
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.isEnabled !== this.props.isEnabled) {
      this.isEnabled = newProps.isEnabled
    }
  }

  render () {
    switch (this.props.pressMode) {
      case PRESS_MODE.highlight:
        return (
          <WeTouchableHighlight {...this.props} onPress={() => this.onPress()}>
            {this.props.children}
          </WeTouchableHighlight>
        )
      case PRESS_MODE.mask:
        return (
          <WeTouchableMask {...this.props} onPress={() => this.onPress()}>
            {this.props.children}
          </WeTouchableMask>
        )
      case PRESS_MODE.none: {
        const props = {
          ...this.props,
          activeOpacity: 1
        }
        return (
          <WeTouchableOpacity {...props} onPress={() => this.onPress()}>
            {this.props.children}
          </WeTouchableOpacity>
        )
      }
      default:
        return (
          <WeTouchableOpacity {...this.props} onPress={() => this.onPress()}>
            {this.props.children}
          </WeTouchableOpacity>
        )
    }
  }

  onPress () {
    let {
      onPress: originOnPress = () => {},
      throttleOnPress = true
    } = this.props

    if (throttleOnPress) {
      if (!this.isEnabled) {
        console.log('别点了，喝杯水休息一下')
        return
      }
      originOnPress()
    } else {
      originOnPress()
    }
  }
}

WeTouchable.PressMode = PRESS_MODE

export default WeTouchable
