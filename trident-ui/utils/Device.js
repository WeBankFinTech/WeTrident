/**
 * Created by erichua on 25/10/2017.
 */

import {
  Dimensions,
  Platform
} from 'react-native'

export default class Device {
  static containerHeight = Dimensions.get('window').height

  static isPhoneX () {
    const { height, width } = Dimensions.get('window')
    return Platform.OS === 'ios' && parseInt((height / width) * 100) === 216
  }

  static isiOSDevice () {
    return Platform.OS === 'ios'
  }

  /**
   * 检查，是否支持手机号码登陆
   * 获取是否是IOS／Android版本
   */
  static isMobileDevice () {
    return Platform.OS === 'ios' || Platform.OS === 'android'
  }

  /**
   * 是否是iOS 12以上系统
   */
  static isAtLeastIOS12 () {
    return Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 12
  }

  /**
   * 设置Container高度
   */
  static setContainerHeight (height) {
    Device.containerHeight = height
  }

  /**
   * 获取Container高度
   */
  static getContainerHeight () {
    return Device.containerHeight
  }
}
