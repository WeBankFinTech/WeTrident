/**
 * Created by vengeanliu on 2017/7/28.
 * Updated by lemorili
 */
import React, { Component } from 'react'
import { View, Animated, StyleSheet, Image } from 'react-native'
import { PopupStub } from '@unpourtous/react-native-popup-stub'
import ThemeableComponent from '../../theme/ThemeableComponent'

export default class Loading extends ThemeableComponent {
  namespace = 'Loading'
  static _id = null

  constructor (props) {
    super(props)

    this.state = {
      rotate: new Animated.Value(0)
    }
    this._runAnimation = this._runAnimation.bind(this)
  }

  _runAnimation () {
    this.state.rotate.setValue(0)
    Animated.timing(this.state.rotate, {
      toValue: 3,
      duration: 700,
      useNativeDriver: true
    }).start(this._runAnimation)
  }

  componentDidMount () {
    this._runAnimation()
  }

  static show () {
    Loading._id = PopupStub.addPopup(<Loading />, {
      name: 'Loading',
      mask: false,
      lock: true,
      zIndex: 600,
      delay: 0,
      duration: 200,
      // animation: {from: {opacity: 0}, to: {opacity: 1}},
      easing: 'ease-in-out',
      position: 'center'
    })
  }

  static hide () {
    PopupStub.removePopup(Loading._id)
    Loading._id = null
  }

  static isShow () {
    return Loading._id !== null
  }

  /**
   * 自动给promise加上loading
   * @param {Promise} promise
   */
  static wrap (promise) {
    Loading.show()
    return new Promise((resolve, reject) => {
      promise.then((res) => {
        Loading.hide()
        resolve(res)
      }, (err) => {
        Loading.hide()
        reject(err)
      })
    })
  }

  render () {
    const {
      style
    } = this.getComponentTheme()
    return (
      <View style={style}>
        <View style={styles.dotContainer}>
          <Animated.View renderToHardwareTextureAndroid style={[styles.dot, {
            opacity: this.state.rotate.interpolate({
              inputRange: [0, 1, 2, 3],
              outputRange: [0.2, 1, 0.2, 0.2]
            })
          }]} />
          <Animated.View renderToHardwareTextureAndroid style={[styles.dot, {
            opacity: this.state.rotate.interpolate({
              inputRange: [0, 1, 2, 3],
              outputRange: [0.2, 0.2, 1, 0.2]
            })
          }]} />
          <Animated.View renderToHardwareTextureAndroid style={[styles.dot, {
            opacity: this.state.rotate.interpolate({
              inputRange: [0, 1, 2, 3],
              outputRange: [0.2, 0.2, 0.2, 1]
            })
          }]} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  img: {
    width: 31,
    height: 37
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    opacity: 0.2
  }
})
