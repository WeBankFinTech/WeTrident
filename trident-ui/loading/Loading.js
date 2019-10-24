/**
 * Created by vengeanliu on 2017/3/22.
 */

'use strict'
import Svg from 'react-native-svg'

import {Animated, Easing} from 'react-native'
import React, {Component} from 'react'
import DashCircle from '../loading/DashCircle'

export default class LoadingDemo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      strokeDashOffset: new Animated.Value(0),
      strokeDasharray: new Animated.Value(1),
      rotate: new Animated.Value(0)
    }
    this.AnimatedSvg = Animated.createAnimatedComponent(Svg)
    this.AnimatedCircle = Animated.createAnimatedComponent(DashCircle)
  }

  _rotateCircle () {
    this.state.rotate.setValue(0)
    Animated.timing(
            this.state.rotate,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear
      }
        ).start(() => {
          if (!this.unmounted) {
            this._rotateCircle()
          }
        })
  }

  _animation () {
    this.state.strokeDashOffset.setValue(0)
    this.state.strokeDasharray.setValue(1)
    Animated.parallel([
      Animated.sequence([
        Animated.timing(
                    this.state.strokeDashOffset,
          {
            toValue: -35,
            duration: 750,
            easing: Easing.linear
          }
                ),
        Animated.timing(
                    this.state.strokeDashOffset,
          {
            toValue: -124,
            duration: 750,
            easing: Easing.linear
          }
                )
      ]),
      Animated.timing(
                this.state.strokeDasharray,
        {
          toValue: 89,
          duration: 750,
          easing: Easing.linear
        }
            )
    ]).start(() => {
      if (!this.unmounted) {
        this._animation()
      }
    })
  }

  componentDidMount () {
    this._animation()
    this._rotateCircle()
  }

  componentWillUnmount () {
    this.unmounted = true
  }

  render () {
    let AnimatedSvg = this.AnimatedSvg
    let AnimatedCircle = this.AnimatedCircle
    return (
      <AnimatedSvg style={[{
        transform: [{
          rotate: this.state.rotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
          })
        }]
      }, this.props.style]} width='48' height='48'>
        <AnimatedCircle strokeDashOffset={this.state.strokeDashOffset}
          strokeDasharray={this.state.strokeDasharray} strokeLinecap='round' />
      </AnimatedSvg>
    )
  }
};
