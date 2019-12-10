import React, { Component } from 'react'
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import WeTouchable from '../../lib/WeTouchable'
import ThemeProvider from '../../theme/ThemeProvider'
import ThemeableComponent from '../../theme/ThemeableComponent'

const Theme = ThemeProvider.Theme

export default class NavBar extends ThemeableComponent {
  namespace = 'NavBar'
  themeStyleKeys = [
    'style',
    'leftButtonStyle',
    'leftButtonTextStyle',
    'leftButtonImageStyle',

    'titleStyle',
    'titleTextStyle',

    'rightButtonStyle',
    'rightButtonTextStyle',
  ]
  static propTypes = {
    hideLeftButton: PropTypes.bool,
    leftButtonText: PropTypes.string,
    leftButtonTextStyle: PropTypes.object,
    leftButtonImage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    leftButtonImageStyle: PropTypes.object,
    onPressLeft: PropTypes.func,
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    rightButtonText: PropTypes.string,
    rightButtonTextStyle: PropTypes.object,
    rightButtonImage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rightButtonImageStyle: PropTypes.object,
    onPressRight: PropTypes.func
  }

  renderLeft () {
    const onPress = () => {
      if (this.props.hideLeftButton && this.props.hideLeftButton === true) {
        return
      }
      if (this.props.onPressLeft) {
        this.props.onPressLeft()
      }
    }

    const {
      leftButtonTextStyle,
      leftButtonImageStyle
    } = this.getComponentTheme()
    return (
      <WeTouchable onPress={onPress} hitSlop={{ top: 10, left: 20, bottom: 10, right: 20 }}>
        {(this.props.hideLeftButton && this.props.hideLeftButton === true) ? <View style={{ width: 70 }} />
          : <View style={styles.actionLeftItem}>
            {
              !this.props.leftButtonText ? <Image
                style={[leftButtonImageStyle]} // 原w,h:18
                source={this.props.leftButtonImage || require('./images/back-icon.png')}
                resizeMode='cover' /> : null
            }
            {
              this.props.leftButtonText &&
              <Text style={[leftButtonTextStyle]}>{this.props.leftButtonText}</Text>
            }
          </View>}
      </WeTouchable>
    )
  }

  renderTitle () {
    const { titleTextStyle } = this.getComponentTheme()
    return <Animated.Text
      numberOfLines={1}
      style={[titleTextStyle]}>{this.props.title ? this.props.title : ''}</Animated.Text>
  }

  renderRight () {
    const onPress = () => {
      if (!this.props.rightButtonText && !this.props.rightButtonImage) {
        return
      }
      if (this.props.onPressRight) {
        this.props.onPressRight()
      }
    }

    const {
      rightButtonTextStyle
    } = this.getComponentTheme()
    return (
      <WeTouchable
        onPress={onPress}
        hitSlop={{ top: 10, left: 20, bottom: 10, right: 20 }}
        style={{ width: 70 }}>
        {
          (this.props.rightButtonText || this.props.rightButtonImage) && <View style={styles.actionRightItem}>
            {
              this.props.rightButtonImage && <Image
                style={[{ width: 26, height: 26 }, this.props.rightButtonImageStyle]}
                source={this.props.rightButtonImage}
                resizeMode='cover' />
            }
            {
              this.props.rightButtonText && <Text style={[rightButtonTextStyle]}>
                {this.props.rightButtonText}
              </Text>
            }
          </View>
        }
      </WeTouchable>
    )
  }

  render () {
    const {
      style,
      leftButtonStyle,
      leftButtonTextStyle,

      titleStyle,
      titleTextStyle,

      rightButtonStyle,
      rightButtonTextStyle,
    } = this.getComponentTheme()
    return (
      <Animated.View
        style={[style]}>
        {this.props.renderLeft ? this.props.renderLeft() : this.renderLeft()}
        {this.props.renderTitle ? this.props.renderTitle() : this.renderTitle()}
        {this.props.renderRight ? this.props.renderRight() : this.renderRight()}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  actionLeftItem: {
    // flexDirection: 'row',
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    // width: 70
  },
  actionRightItem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
})
