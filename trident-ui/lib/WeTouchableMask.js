/**
 * Created by vengeanliu on 2017/7/5.
 */
import {
  TouchableWithoutFeedback,
  View
} from 'react-native'
import React, { Component } from 'react'

let CHILD_REF = 'childRef'

export default class WeTouchableMask extends Component {
  constructor (props) {
    super(props)
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
      <TouchableWithoutFeedback {...this.props} onPressIn={() => {
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
        <View>
          {React.cloneElement(
            React.Children.only(this.props.children),
            {
              ref: CHILD_REF
            }
          )}
          {this.state.active && <View style={[
            this.props.children && this.props.children.props ? this.props.children.props.style : null,
            {
              position: 'absolute',
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }
          ]} />}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
