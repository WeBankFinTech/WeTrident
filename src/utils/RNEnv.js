/* eslint-disable no-undef */
/**
 * Utils for react native environment detection
 */
export default class RNEnv {
  /**
   * If the native is in Debug mode
   */
  // static isNativeDebug () {
  //   // TODO 不能这样判断, 要用通用的判断
  //   return !!(RNEnv.APP_INFO && RNEnv.APP_INFO.isDebug === 1)
  // }

  /**
   * 是否Dev模式
   */
  static isDev () {
    return __DEV__
  }

  /**
   * If react native current in remote debug mode
   */
  static isRemoteDebug () {
    return window.navigator && window.navigator.userAgent !== undefined
  }
}
