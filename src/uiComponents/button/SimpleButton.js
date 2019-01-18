/**
 * Created by vengeanliu on 2017/3/31.
 */
'use strict'
import React, {Component} from 'react'
import {
    View,
    Text,
    PixelRatio
} from 'react-native'
import WeTouchable from '../ext/WeTouchable'
import PropTypes from 'prop-types'

export default class SimpleButton extends Component {
  static propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func,
    onPress: PropTypes.func,
    isEnabled: PropTypes.bool,
    // 最早编写这个组件的时候没有考虑定位这些style其实是要放在touchable组件那层的，为了避免风险，以增量代码方式提供positionStyle
    positionStyle: PropTypes.object
  }

  static defaultProps = {
    isEnabled: true
  }
  constructor (props) {
    super(props)
    this.props = props
  }
  render () {
    return (
      <WeTouchable style={this.props.positionStyle} onPress={() => {
        const onPress = this.props.onPress || this.props.onClick
        this.props.isEnabled && onPress && onPress()
      }} activeOpacity={this.props.isEnabled ? null : 1}>
        <View style={[{
          borderColor: '#dcb35f',
          borderWidth: 1 / PixelRatio.get(),
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 22,
          height: 44,
          opacity: this.props.isEnabled ? 1 : 0.3
        }, this.props.style]}>
          <Text style={[{
            color: '#dcb35f',
            fontSize: 17,
            backgroundColor: 'transparent'
          }, this.props.textStyle]}>{this.props.title}</Text>
        </View>
      </WeTouchable>
    )
  }
}
