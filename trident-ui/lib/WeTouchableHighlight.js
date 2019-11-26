/**
 * Created by vengeanliu on 2017/7/5.
 */
import {
  TouchableOpacity,
  View
} from 'react-native'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

let CHILD_REF = 'childRef'

export default class WeTouchableHighlight extends Component {
  static propTypes = {
    activeColor: PropTypes.string, // 点击后组件高亮
    activeType: PropTypes.string,
    needsOffscreenAlphaCompositing: PropTypes.bool  // 决定这个视图是否要先离屏渲染再进行半透明度处理，见官方文档
  }

  constructor (props) {
    super(props)
    this.style = this.props.children && this.props.children.props ? this.props.children.props.style : null
    this.state = {
      active: false
    }

    this.highlight = this._highlight.bind(this)
    this.reset = this._reset.bind(this)
  }

  _highlight () {
    this.setState({active: true})
  }

  _reset () {
    this.setState({active: false})
  }

  render () {
    return (
      <TouchableOpacity activeOpacity={1} {...this.props} onPressIn={() => {
        if (this.props.onPressIn) {
          this.props.onPressIn()
        }
        this.highlight()
      }} onPressOut={() => {
        if (this.props.onPressOut) {
          this.props.onPressOut()
        }
        this.reset()
      }}>
        <View needsOffscreenAlphaCompositing={this.props.needsOffscreenAlphaCompositing} style={{opacity: this.props.disabled ? 0.3 : 1}}>
          {React.cloneElement(
            React.Children.only(this.props.children),
            {
              ref: CHILD_REF,
              style: [
                this.style,
                this.state.active ? {
                  backgroundColor: this.props.activeColor
                    ? this.props.activeColor
                    : this.props.activeType === 'dark' ? '#1D2027' : '#f5f5f5'
                } : null
              ]
            }
          )}
        </View>
      </TouchableOpacity>
    )
  }
}
