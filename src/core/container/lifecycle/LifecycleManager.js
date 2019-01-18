/**
 * App全局的生命周期管理，通过注册各自的类到这里，在合适的时候就会得到通知
 * Created by erichua on 11/10/2017.
 */
import {
  NativeModules,
  NativeEventEmitter
} from 'react-native'
const LIFECYCLE = {
  RESUME: 'LifeCycle_Resume'
}
export default class LifecycleManager {
  static appResumeLisenerList = []
  static appPauseLisenerList = []
  static HNWAppResumeListener = null;

  static addAppResumeListener (listener, tag) {
    // TODO check if it is a LifeCycleListener
    this.appResumeLisenerList.push({
      listener,
      tag
    })
  }

  static addAppPauseListener (listener, tag) {
    // TODO check if it is a LifeCycleListener
    this.appPauseLisenerList.push({
      listener,
      tag
    })
  }

  static notifyAppResume (isFirst) {
    LifecycleManager.appResumeLisenerList.forEach(item => {
      item && item.listener && item.listener.onAppResume(isFirst)
    })
  }

  static notifyAppPause () {
    LifecycleManager.appPauseLisenerList.forEach(item => {
      item && item.listener && item.listener.onAppPause()
    })
  }

  // 由于hnw切换回hj正常情况下不会销毁hnw的实例，当从hj切换回hnw时需要报一个hnw resume的事件让hnw执行一些恢复或刷新数据／状态的操作
  static initHNWAppResumeListener () {
    if (NativeModules.LifeCycleNative && LifecycleManager.HNWAppResumeListener === null) {
      LifecycleManager.HNWAppResumeListener = new NativeEventEmitter(NativeModules.LifeCycleNative).addListener(LIFECYCLE.RESUME, () => {
        LifecycleManager.notifyAppResume(false)
      })
    }
  }
}
