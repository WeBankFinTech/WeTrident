import React, {Component} from 'react'
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import { AppNavigator } from '@webank/trident'
import Theme from '@webank/trident/library/uiComponent/Theme'
import dimens from '@webank/trident/library/uiComponent/dimens'
import WeTouchable from '@unpourtous/react-native-touchable/library/WeTouchable'

export default class NavBar extends Component {
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
      } else {
        AppNavigator.goBack()
      }
    }
    return (
      <WeTouchable onPress={onPress} hitSlop={{top: 10, left: 20, bottom: 10, right: 20}}>
        {(this.props.hideLeftButton && this.props.hideLeftButton === true) ? <View style={{width: 70}} />
          : <View style={styles.actionLeftItem}>
            {
              !this.props.leftButtonText ? <Image
                style={[{width: 26, height: 26}, this.props.leftButtonImageStyle]} // 原w,h:18
                source={this.props.leftButtonImage || require('../../images/back-icon.png')}
                resizeMode='cover' /> : null
            }
            {
              this.props.leftButtonText && <Text style={[styles.buttonText, this.props.leftButtonTextStyle]}>{this.props.leftButtonText}</Text>
            }
          </View>}
      </WeTouchable>
    )
  }

  renderTitle () {
    return <Animated.Text numberOfLines={1} style={[styles.titleView, this.props.titleStyle]}>{this.props.title ? this.props.title : ''}</Animated.Text>
  }

  renderRight () {
    const onPress = () => {
      if (!this.props.rightButtonText && !this.props.rightButtonImage) {
        return
      }
      if (this.props.onPressRight) {
        this.props.onPressRight()
      } else {
        AppNavigator.goBack()
      }
    }
    return (
      <WeTouchable onPress={onPress}
                   hitSlop={{top: 10, left: 20, bottom: 10, right: 20}}
                   style={{width: 70}}>
        {
          (this.props.rightButtonText || this.props.rightButtonImage) && <View style={styles.actionRightItem}>
            {
              this.props.rightButtonImage && <Image
                style={[{width: 26, height: 26}, this.props.rightButtonImageStyle]}
                source={this.props.rightButtonImage}
                resizeMode='cover' />
            }
            {
              this.props.rightButtonText && <Text style={[styles.buttonText, this.props.rightButtonTextStyle]}>
                {this.props.rightButtonText}
              </Text>
            }
          </View>
        }
      </WeTouchable>
    )
  }

  render () {
    return (
      <Animated.View
        style={[styles.overlay, this.props.style]}>
        {this.props.renderLeft ? this.props.renderLeft() : this.renderLeft()}
        {this.props.renderTitle ? this.props.renderTitle() : this.renderTitle()}
        {this.props.renderRight ? this.props.renderRight() : this.renderRight()}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    zIndex: 3,
    backgroundColor: Theme.color.pageBackground,
    width: dimens.WINDOW_WIDTH,
    height: dimens.TOTAL_NAV_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: dimens.STATUS_BAR_HEIGHT,
    paddingLeft: Theme.spaceX.medium,
    paddingRight: Theme.spaceX.medium

  },
  actionLeftItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: 70
  },
  actionCloseItem: {
    marginBottom: 0
  },
  actionRightItem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  titleView: {
    flex: 1,
    color: 'rgba(0, 0, 0, 0.9)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 17
  },
  buttonText: {
    color: Theme.color.lightPrimary,
    fontSize: Theme.fontSize.medium
  }
})