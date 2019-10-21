import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Platform,
  View,
  StyleSheet,
  Image,
  I18nManager
} from 'react-native'
import { WeTouchable } from '@unpourtous/react-native-touchable'
import { AppNavigator } from '@webank/trident'


export default class NavBackButton extends Component {
  static propTypes = {
    onPress: PropTypes.func
  }

  static defaultProps = {
    onPress: () => AppNavigator.goBack()
  }

  render () {
    return (
      <WeTouchable
        hitSlop={{top: 10, left: 20, bottom: 10, right: 20}}
        onPress={this.props.onPress}>
        <View style={styles.backContainer}>
          <Image style={styles.icon} source={require('../images/back-icon.png')}/>
        </View>
      </WeTouchable>
    )
  }
}

const styles = StyleSheet.create({
  backContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  icon:
    Platform.OS === 'ios'
      ? {
        height: 21,
        width: 13,
        marginLeft: 9,
        marginRight: 22,
        marginVertical: 12,
        resizeMode: 'contain',
        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
      }
      : {
        height: 24,
        width: 24,
        margin: 16,
        resizeMode: 'contain',
        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
      },
})