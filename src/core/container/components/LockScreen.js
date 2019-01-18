/**
 * Created by williamcolyndeng on 2017/8/30.
 */
'use strict'

import { NativeModules, NativeEventEmitter, Platform } from 'react-native'

import WeApi from '../../api/WeApi'
import CGI from '../../api/CGI'
import {
  LocalStorage,
  Dialog,
  Toast,
  Loading
} from 'apps/webankPro/bizComponents'
import { PreferencesKey } from 'apps/webankPro/constants'
import {
  CommonBridge,
  AuthManager
} from 'plugins'
import { LoginHelper } from 'apps/webankPro/serviceHelper'
import FingerprintService from './FingerprintService'
import { AppNavigator } from 'apps/webankPro/navigation'
import { Device } from 'utils'
import constants from '../../modules/setting/FingerprintScene/constants'

// const EVENTKEY_PARAMS_ERROR = 'ParamsError'
const EVENTKEY_UNLOCK = 'UnlockEvt'
/**
 * ULS0000 设置手势密码成功
 * ULS0001 验证成功
 * ULS0002 手势密码验证失败
 * ULS0003 指纹验证失败-错误次数过多
 * ULS0004 切换交易密码登录
 * ULS0005 切换其他账号登录
 * ULS0006 忘记手势密码
 * ULS0007 Touch ID有变化
 * ULS0008 设备不能进行指纹登录
 * ULS0009 取消-其他原因导致指纹验证被取消或无法正常进行
 */
const LOCK_SCREEN_RESULT_CODE = {
  GESTURE_SET_SUCCESS: 'ULS0000',
  GESTURE_AUTH_SUCCESS: 'ULS0001',
  GESTURE_AUTH_FAILURE: 'ULS0002',
  GESTURE_AUTH_FORGET: 'ULS0006',
  FINGERPRINT_AUTH_SUCCESS: 'ULS0001',
  FINGERPRINT_AUTH_FAILURE: 'ULS0003',
  FINGERPRINT_AUTH_CHANGED: 'ULS0007',
  FINGERPRINT_AUTH_UNABLE: 'ULS0008',
  FINGERPRINT_AUTH_CANCEL_1: 'ULS0009',
  FINGERPRINT_AUTH_FIDERROR: 'ULS0010',
  LOCKSCREEN_SWITCH_PASSWORD: 'ULS0004',
  LOCKSCREEN_SWITCH_ACCOUNT: 'ULS0005'
}
const LOCK_SCREEN_MODE = {
  UNDEFINED: 0,
  GSSETTING: 1,
  GSAUTH: 2,
  FPAUTH: 3
}
const GESTURE_PASSWORD_TYPE = {
  OLD: 0, // 非加盐手势密码
  NEW: 1 // 加盐手势密码
}
const md5 = require('md5')
let instance = null

class LockScreen {
  constructor () {
    if (!instance) {
      this.userInfo = {}
      this.lockScreenSubscription = null
      this.lastUsedMode = LOCK_SCREEN_MODE.UNDEFINED
      this.passwordVerifySuccessCallback = null
      this.passwordSessionID = null

      this.lockAction = false
      instance = this
    }

    this._initSubscription()

    return instance
  }

  static getInstance () {
    return new LockScreen()
  }

  _initSubscription () {
    if (!this._hasAbility()) {
      return
    }

    if (this.lockScreenSubscription == null) {
      this.lockScreenSubscription = new NativeEventEmitter(NativeModules.LockScreenNative).addListener(EVENTKEY_UNLOCK, (result) => {
        if (result) {
          // 防止重入
          if (result.code === LOCK_SCREEN_RESULT_CODE.GESTURE_AUTH_FORGET ||
            result.code === LOCK_SCREEN_RESULT_CODE.LOCKSCREEN_SWITCH_PASSWORD ||
            result.code === LOCK_SCREEN_RESULT_CODE.LOCKSCREEN_SWITCH_ACCOUNT) {
            if (this.lockAction) {
              return
            } else {
              this.lockAction = true
              setTimeout(() => {
                this.lockAction = false
              }, 1000)
            }
          }

          switch (result.code) {
            case LOCK_SCREEN_RESULT_CODE.GESTURE_SET_SUCCESS:
              if (result.gesture_password) {
                this._setNewGesture(result.gesture_password)
              }
              break
            case LOCK_SCREEN_RESULT_CODE.GESTURE_AUTH_FORGET:
              this.lastUsedMode = LOCK_SCREEN_MODE.GSAUTH
              this._verifyPassword(this._onForgetGesture.bind(this))
              break
            case LOCK_SCREEN_RESULT_CODE.FINGERPRINT_AUTH_FAILURE:
              this.lastUsedMode = LOCK_SCREEN_MODE.FPAUTH
              this._verifyPassword(null)
              break
            case LOCK_SCREEN_RESULT_CODE.FINGERPRINT_AUTH_CHANGED:
              this.lastUsedMode = LOCK_SCREEN_MODE.FPAUTH
              this._verifyPassword(this._onTouchIDChanged.bind(this))
              break
            case LOCK_SCREEN_RESULT_CODE.LOCKSCREEN_SWITCH_PASSWORD:
              if (result.mode === LOCK_SCREEN_MODE.FPAUTH) {
                this.lastUsedMode = LOCK_SCREEN_MODE.FPAUTH
              } else if (result.mode === LOCK_SCREEN_MODE.GSAUTH) {
                this.lastUsedMode = LOCK_SCREEN_MODE.GSAUTH
              }
              this._verifyPassword(null)
              break
            case LOCK_SCREEN_RESULT_CODE.LOCKSCREEN_SWITCH_ACCOUNT:
              LoginHelper.switchAccount()
              break
            case LOCK_SCREEN_RESULT_CODE.FINGERPRINT_AUTH_FIDERROR:
              this.lastUsedMode = LOCK_SCREEN_MODE.FPAUTH
              this._verifyPassword(this._onFIDError.bind(this))
              break
            case LOCK_SCREEN_RESULT_CODE.GESTURE_AUTH_SUCCESS:
            case LOCK_SCREEN_RESULT_CODE.FINGERPRINT_AUTH_SUCCESS:
              this._hideNativeLoading()
              break
            case LOCK_SCREEN_RESULT_CODE.GESTURE_AUTH_FAILURE:
            case LOCK_SCREEN_RESULT_CODE.FINGERPRINT_AUTH_UNABLE:
            case LOCK_SCREEN_RESULT_CODE.FINGERPRINT_AUTH_CANCEL_1:
              break
          }
        }
      })

      // if (this.lockScreenSubscription && this._hasLaunchAbility()) {
      //   NativeModules.LockScreenNative.lockScreenJob({
      //     Type: 'JSReady'
      //   })
      // }
    }
  }

  start (mode) {
    if (!this._hasAbility() || !this.userInfo.ecifNo) {
      return
    }

//     this._initSubscription() // 能力级拿的有点慢

    const {
      picurl: avatar = null,
      username: nickName
    } = WeApi.getUserInfo()

    let designateMode = mode
    if (!mode && !this.userInfo.gesture) {
      designateMode = LOCK_SCREEN_MODE.GSSETTING
    }

    NativeModules.LockScreenNative.lockScreenJob({
      Type: 'Open',
      Ecif: this.userInfo.ecifNo,
      Pass: this.userInfo.gesture,
      Head: LoginHelper.getIdCardLoginInfo() ? '' : avatar,
      Nick: nickName,
      Mode: designateMode
    })
  }

  finish () {
    if (!this._hasAbility()) {
      return
    }
    NativeModules.LockScreenNative.lockScreenJob({
      Type: 'Close'
    })
  }

  setTheme () {
    if (!this._hasAbility()) {
      return
    }
    NativeModules.LockScreenNative.lockScreenJob({
      Type: 'SetTheme'
    })
  }

  setUserInfo (ecifNo, gesture) {
    if (!this._hasAbility()) {
      return
    }

    // this._initSubscription()

    const {
      picurl: avatar = null,
      username: nickName
    } = WeApi.getUserInfo()
    this.userInfo.ecifNo = ecifNo
    this.userInfo.gesture = gesture
    NativeModules.LockScreenNative.lockScreenJob({
      Type: 'SetUserInfo',
      Ecif: ecifNo,
      Pass: gesture,
      Head: LoginHelper.getIdCardLoginInfo() ? '' : avatar,
      Nick: nickName
    })
  }

  clearUserInfo () {
    if (!this._hasAbility()) {
      return
    }
    this.userInfo = {}
    NativeModules.LockScreenNative.lockScreenJob({
      Type: 'ClearUserInfo'
    })
  }

  onVerifyPasswordSuccess (session) {
    if (this.passwordVerifySuccessCallback != null) {
      this.passwordSessionID = session
      this.passwordVerifySuccessCallback()
    }
    this.passwordVerifySuccessCallback = null
    this.lastUsedMode = LOCK_SCREEN_MODE.UNDEFINED
  }

  onVerifyPasswordCancel () {
    this.passwordSessionID = null
    this.passwordVerifySuccessCallback = null
    if (this.lastUsedMode === LOCK_SCREEN_MODE.FPAUTH || this.lastUsedMode === LOCK_SCREEN_MODE.GSAUTH) {
      this.start(this.lastUsedMode)
    }
    this.lastUsedMode = LOCK_SCREEN_MODE.UNDEFINED
  }

  modifyGesture (sessionID, callback) {
    if (!sessionID) {
      return
    }
    this.passwordSessionID = sessionID
    this.modifyGestureCallback = callback
    this.start(LOCK_SCREEN_MODE.GSSETTING)
  }

  showLockScreenGuide () {
    if (!this.userInfo.ecifNo) {
      return
    }
    if (this.skipGuide) {
      this.skipGuide = false
      return
    }
    if (!this.userInfo.gesture) {
      this.start(LOCK_SCREEN_MODE.GSSETTING)
    }
    // 设置指纹弹窗移动到pupup的相关组件里面
    // else {
    //   let flag = await LocalStorage.loadDataByUser(PreferencesKey.FPA_ALERT_KEY).catch(error => {
    //     console.log(error.message)
    //   })
    //   FingerprintService.canUseFPA().then(() => {
    //     FingerprintService.canUseFPA(this.userInfo.ecifNo).then(() => {},
    //       () => {
    //         if (!flag || flag !== '1') {
    //           this._showFPAGuide()
    //         }
    //       })
    //   }, () => {
    //   })
    // }
  }

  getLockScreenGuideDetailsForPopups () {
    return new Promise(async (resolve, reject) => {
      let getAlertFlag = async () => {
        let flag = await LocalStorage.loadDataByUser(PreferencesKey.FPA_ALERT_KEY).catch(error => {
          console.log(error.message)
        })
        return flag
      }

      let skip = false
      let resolveDetails = function (skip) {
        let details = {}
        details.skip = skip
        resolve(details)
      }
      if (!this.userInfo.ecifNo) {
        skip = true
      }
      if (this.skipGuide) {
        skip = true
      }
      if (AppNavigator.currentScene && AppNavigator.currentScene.routeName !== AppNavigator.home.HomeScene.toString()) {
        skip = true
      }

      if (skip) {
        resolveDetails(true)
      } else {
        let flag = await getAlertFlag()

        if (flag === '1') {
          resolveDetails(true)
        } else {
          FingerprintService.canUseFPA().then(() => {
            FingerprintService.canUseFPA(this.userInfo.ecifNo).then(
              () => {
                resolveDetails(true)
              },
              () => { // 原生对于当前用户还没有设置指纹
                resolveDetails(false)
              })
          }, () => {
            resolveDetails(true)
          })
        }
      }
    })
  }

  _unlockGesture () {
    if (!this.userInfo.ecifNo) {
      return
    }
    NativeModules.LockScreenNative.lockScreenJob({
      Type: 'GSClear',
      Ecif: this.userInfo.ecifNo
    })
  }

  // 临时方案，通知angular更新手势密码
  _notifyAngularRefresh () {
    if (!this.userInfo.gesture || !NativeModules.GesturePasswordNative) {
      return
    }
    NativeModules.GesturePasswordNative.gesturePasswordJob({
      Type: 'Notify',
      Pass: this.userInfo.gesture
    })
  }

  _setNewGesture (rawGesture) {
    Loading.show()
    let encodedGesturePassword = ''
    if (this.userInfo.ecifNo) {
      encodedGesturePassword = md5(md5(md5(rawGesture)) + this.userInfo.ecifNo)
    }
    let params = {
      type: GESTURE_PASSWORD_TYPE.NEW,
      password: encodedGesturePassword,
      session_id: this.userInfo.gesture ? this.passwordSessionID : ''
    }
    WeApi.post(CGI.submitNewGesturePassword, params).then(() => {
      Toast.show('设置成功', Toast.ICON.SUCCESS)
      this.setUserInfo(this.userInfo.ecifNo, encodedGesturePassword)
      this._unlockGesture()
      if (this.modifyGestureCallback) {
        // 在回调里面处理angular更新新的手势密码的逻辑
        this.modifyGestureCallback(true, encodedGesturePassword)
      } else {
        this._notifyAngularRefresh()
      }
    }, () => {
      Toast.show('设置手势密码失败')
      if (this.modifyGestureCallback) {
        this.modifyGestureCallback(false)
      }
    }).then(() => {
      Loading.hide()
      this.modifyGestureCallback = null
    })
    this.passwordSessionID = null
  }

  _verifyPassword (successCallback) {
    this.passwordVerifySuccessCallback = successCallback
    AuthManager.setPreventJump(true)
    AppNavigator.security.PasswordUnlockScene()
  }

  _hideNativeLoading () {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        CommonBridge.callNative({
          type: 'switchLoading',
          cmdId: 'hide'
        }, () => {
          console.log('CommonBridge back')
        })
      }, 1000)
    }
  }

  _onForgetGesture () {
    this.start(LOCK_SCREEN_MODE.GSSETTING)
  }

  _onTouchIDChanged () {
    setTimeout(() => {
      Dialog.show({
        texts: [
          Device.isPhoneX() ? constants.TOUCH_ID_ALERT.BODY_X : constants.TOUCH_ID_ALERT.BODY
        ],
        items: [
          {
            text: constants.TOUCH_ID_ALERT.CANCEL,
            onItemPress: () => {
              Dialog.hide()
              FingerprintService.disableFPA(this.userInfo.ecifNo).then(() => {
                Toast.show(Device.isPhoneX() ? constants.FPA_CLOSE_TOAST.TOAST_TEXT_X : constants.FPA_CLOSE_TOAST.TOAST_TEXT)
                console.log('TouchID有变化，首页禁用指纹成功')
              }, () => {
                console.log('TouchID有变化，首页禁用指纹失败')
              })
            }
          },
          {
            text: constants.TOUCH_ID_ALERT.CONFIRM,
            onItemPress: () => {
              Dialog.hide()
              FingerprintService.ackTouchIDChange(this.userInfo.ecifNo)
            }
          }
        ]
      })
    }, 1000)
  }

  _hasAbility () {
    // return AbilityManager.hasNativeAbility('ABILITY_WERICH_LOCKSCREEN')
    // 我们认为PRO 天生具有该能力
    // 我是来膜拜站长的
    return true
  }

  _hasLaunchAbility () {
    // return AbilityManager.hasNativeAbility('Ability_NativeLaunchControl')
    // 我们认为PRO 天生具有该能力
    return true
  }

  _onFIDError () {
    NativeModules.LockScreenNative.lockScreenJob({
      Type: 'UpdateFp',
      PwdSession: this.passwordSessionID
    })
    this.passwordSessionID = null
  }

  // 启用指纹弹窗，移动到弹窗链
  // _showFPAGuide () {
  //   if (AppNavigator.currentScene && AppNavigator.currentScene.routeName !== AppNavigator.home.HomeScene.toString()) {
  //     return
  //   }
  //   Dialog.show({
  //     icon: Device.isPhoneX() ? <Icon name='face' /> : <Icon name='fingerprint' />,
  //     title: Device.isPhoneX() ? constants.FPA_ALERT.TITLE_X : constants.FPA_ALERT.TITLE,
  //     texts: [
  //       Device.isPhoneX() ? constants.FPA_ALERT.BODY_X : constants.FPA_ALERT.BODY
  //     ],
  //     items: [
  //       {
  //         text: '取消',
  //         onItemPress: () => {
  //           Dialog.hide()
  //           LocalStorage.saveDataByUser(PreferencesKey.FPA_ALERT_KEY, '1')
  //         }
  //       },
  //       {
  //         text: '启用',
  //         onItemPress: () => {
  //           Dialog.hide()
  //           setTimeout(this._enableFPA.bind(this), 300)
  //         }
  //       }
  //     ]
  //   })
  // }

  _enableFPA () {
    FingerprintService.enableFPA(this.userInfo.ecifNo).then(() => {
      Toast.show('启用成功', Toast.ICON.SUCCESS)
    }, () => {
      Toast.show('启用失败')
    }).then(() => {
      LocalStorage.saveDataByUser(PreferencesKey.FPA_ALERT_KEY, '1')
    })
  }

  _enableFPAForPopups () {
    return FingerprintService.enableFPA(this.userInfo.ecifNo).then(() => {
      Toast.show('启用成功', Toast.ICON.SUCCESS)
      LocalStorage.saveDataByUser(PreferencesKey.FPA_ALERT_KEY, '1')
      return Promise.resolve()
    }, () => {
      Toast.show('启用失败')
      LocalStorage.saveDataByUser(PreferencesKey.FPA_ALERT_KEY, '1')
      return Promise.reject()
    })
  }

  skipLockScreenGuide () {
    this.skipGuide = true
  }
}
export default LockScreen.getInstance()
