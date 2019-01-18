/* eslint-disable no-undef */
export default class RNEnv {
  static APP_INFO = null

  static setAppInfo (appInfo) {
    RNEnv.APP_INFO = appInfo
  }

  /**
   * 原生是否是debug模式
   */
  static isNativeDebug () {
    // 如果APP_INFO不存在是返回false的
    return !!(RNEnv.APP_INFO && RNEnv.APP_INFO.isDebug === 1)
  }

  /**
   * 是否Dev模式
   */
  static isDev () {
    return __DEV__
  }

  static isCloseLog () {
    return false
  }

  /**
   * 是否正在远程调试
   */
  static isRemoteDebug () {
    return window.navigator && window.navigator.userAgent !== undefined
  }
}
