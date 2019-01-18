/**
 * Created by williamcolyndeng on 2017/6/28.
 */
import { NativeModules, NativeEventEmitter, Platform } from 'react-native'
import CommonBridge from '../../../../plugins/CommonBridge'

// const EVENTKEY_PARAMS_ERROR = 'ParamsError'
const EVENTKEY_ENABLE = 'FPEnableEvt'
const EVENTKEY_QUERY = 'FPQueryEvt'
const EVENTKEY_DISABLE = 'FPDisableEvt'
const EVENTKEY_ACK = 'FPAckEvt'

const ISIOS = Platform.OS === 'ios'
const md5 = require('md5')

export default class FingerprintService {
  static enableFPA (ecif) {
    return new Promise((resolve, reject) => {
      const fingerprintModule = NativeModules.LockScreenNative
      const eventKey = EVENTKEY_ENABLE
      var enableFPASubscription = new NativeEventEmitter(fingerprintModule).addListener(eventKey, (data) => {
        enableFPASubscription.remove()
        if (data.result) {
          return resolve()
        } else {
          return reject()
        }
      })

      NativeModules.LockScreenNative.lockScreenJob({
        Type: 'FPEnable',
        Ecif: ecif
      })
    })
  }

  static canUseFPA (ecif) {
    return new Promise((resolve, reject) => {
      const fingerprintModule = NativeModules.LockScreenNative
      const eventKey = EVENTKEY_QUERY
      var queryFPASubscription = new NativeEventEmitter(fingerprintModule).addListener(eventKey, (data) => {
        queryFPASubscription.remove()
        if (data.result) {
          return resolve()
        } else {
          return reject(data.reason)
        }
      })

      NativeModules.LockScreenNative.lockScreenJob({
        Type: 'FPQuery',
        Ecif: ecif
      })
    })
  }

  static disableFPA (ecif) {
    return new Promise((resolve, reject) => {
      const fingerprintModule = NativeModules.LockScreenNative
      const eventKey = EVENTKEY_DISABLE
      var disableFPASubscription = new NativeEventEmitter(fingerprintModule).addListener(eventKey, (data) => {
        disableFPASubscription.remove()
        if (data.result) {
          return resolve()
        } else {
          return reject()
        }
      })

      NativeModules.LockScreenNative.lockScreenJob({
        Type: 'FPClear',
        Ecif: ecif
      })
    })
  }

  static openSysSettings () {
    NativeModules.LockScreenNative.lockScreenJob({
      Type: 'FPSysSet'
    })
  }

  static isTouchIDChanged (openid) {
    return new Promise((resolve, reject) => {
      if (ISIOS && openid) {
        CommonBridge.callNative({
          type: 'nativeStorage',
          cmdId: 'get',
          Key: md5(openid) + '-FPChanged'
        }, (result) => {
          console.log('CommonBridge back with result: ' + result.message.value)
          if (result && result.message && result.message.value === '1') {
            return resolve()
          } else {
            return reject()
          }
        })
      } else {
        return reject()
      }
    })
  }

  static ackTouchIDChange (ecif) {
    return new Promise((resolve, reject) => {
      const fingerprintModule = NativeModules.LockScreenNative
      const eventKey = EVENTKEY_ACK

      var ackFPASubscription = new NativeEventEmitter(fingerprintModule).addListener(eventKey, (data) => {
        ackFPASubscription.remove()
        if (data.result) {
          return resolve()
        } else {
          return reject()
        }
      })

      NativeModules.LockScreenNative.lockScreenJob({
        Type: 'FPAck',
        Ecif: ecif
      })
    })
  }
}
