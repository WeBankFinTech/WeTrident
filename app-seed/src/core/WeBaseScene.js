/**
 * 负责管理Scene的生命周期，提供统一的Scene上下文
 * Created by erichua on 27/12/2017.
 */
import { Component } from 'react'
import {
  Keyboard,
  AppState
} from 'react-native'
import { AppNavigator } from 'apps/webankPro/navigation'
import RNEnv from 'utils/RNEnv'
import PerformanceUtils from 'utils/PerformanceUtils'
import { RidPath, PreRequest } from 'apps/webankPro/services'
import WeSnapShotSharePopup from '../biz/WeSnapShotSharePopup'
import { Statistics } from 'plugins'
import moment from 'moment'

export default class WeBaseScene extends Component {
  constructor () {
    super(...arguments)
    if (RNEnv.isDev()) {
      const {moduleName = '', sceneName = ''} = this.props || {};
      ['componentDidMount', 'render'].forEach(methodName => {
        const origin = this[methodName]
        if (origin) {
          this[methodName] = () => {
            const startTime = new Date().getTime()
            const result = origin.apply(this, ...arguments)
            PerformanceUtils.consoleWarning(startTime, new Date().getTime(), `${moduleName}-${sceneName}-${methodName}`)
            return result
          }
        }
      })
    }
    PreRequest.pre(this)
    const originComponentWillMount = this.componentWillMount
    if (originComponentWillMount) {
      this.componentWillMount = () => {
        let instance = this
        if (RNEnv.isDev()) {
          const {moduleName = '', sceneName = ''} = this.props || {}
          const startTime = new Date().getTime()
          const result = originComponentWillMount.apply(instance, ...arguments)
          this._componentWillMountBase.apply(instance, ...arguments)
          PerformanceUtils.consoleWarning(startTime, new Date().getTime(), `${moduleName}-${sceneName}-componentWillMount`)
          return result
        } else {
          const result = originComponentWillMount.apply(instance, ...arguments)
          this._componentWillMountBase()
          return result
        }
      }
    }
    // 包装原来的生命周期函数，在实例创建的时候完成替换，将原来webasescene中生命周期执行的动作放入_<methodname>Base中执行，
    // 原来的函数内容清空，保证具体的scene无论是否有super，webasescene中注册回调的方法始终都能执行
    ['componentWillUnmount', 'onResume', 'onPause'].forEach(methodName => {
      const origin = this[methodName]
      let instance = this
      if (origin) {
        this[methodName] = (...args) => {
          const result = origin.apply(instance, args)
          this[`_${methodName}Base`](...args)
          return result
        }
      }
    })
  }

  get params () {
    return this.getParams({})
  }

  componentWillMount () {}

  componentWillUnmount () {}

  _componentWillMountBase () {
    const sceneKey = this.props.navigation.state.key
    // 处理生命周期, 添加timeout是为了不要阻塞生命周期函数，导致切页卡顿
    AppNavigator.addOnPauseCallback(sceneKey,
      (from, to) => setTimeout(() => this.onPause.bind(this)(from, to), 0))
    AppNavigator.addOnResumeCallback(sceneKey,
      (from, to) => setTimeout(() => this.onResume.bind(this)(from, to), 0))
    this.isUnmounted = false
    AppState.addEventListener('change', this.handleAppStateChange.bind(this))
  }

  _componentWillUnmountBase () {
    const sceneKey = this.props.navigation.state.key
    if (sceneKey !== 'home/HomeScene') {
      AppNavigator.removeOnPauseCallback(sceneKey)
      AppNavigator.removeOnResumeCallback(sceneKey)
      AppState.removeEventListener('change', this.handleAppStateChange.bind(this))
    }
    const {
      moduleName,
      sceneName
    } = this.props
    RidPath.delSceneRid(moduleName, sceneName)
    PreRequest.cancel(this)
    this.isUnmounted = true
  }

  handleAppStateChange (nextAppState) {
    if (AppState.currentState && AppState.currentState.match(/inactive|background|active/) && nextAppState === 'active') {
      this.stayStartTime = moment()
    } else if (AppState.currentState && AppState.currentState.match(/inactive|background|active/) && nextAppState === 'background') {
      this.stayEndTime = moment()
      if (AppNavigator.currentScene && this.sceneUrl === AppNavigator.currentSceneURL) {
        if (this.stayStartTime) {
          Statistics.reportSceneStayTime(this.stayStartTime, this.stayEndTime, this.sceneUrl, 'home')
        }
      }
    }
  }

  // Invoked when this scene become visible again. It won't be invoked at the first time
  onResume (fromScene, toScene) {}

  onPause (fromScene, toScene) {}

  // Invoked when this scene become visible again. It won't be invoked at the first time
  _onResumeBase (fromScene, toScene) {
    const sceneKey = this.props.navigation.state.key
    console.log('onResume ', sceneKey, 'from: ' + fromScene, 'to: ' + toScene)

    const {
      moduleName,
      sceneName
    } = this.props
    RidPath.delSceneRid(moduleName, sceneName)
    this.stayStartTime = moment()
    this.sceneUrl = AppNavigator.currentSceneURL
  }

  _onPauseBase (fromScene, toScene) {
    Keyboard.dismiss()
    const sceneKey = this.props.navigation.state.routeName
    console.log('onPause ', sceneKey, 'from: ' + fromScene, 'to: ' + toScene)
    this.stayEndTime = moment()
    if (this.isUnmounted) {
      if (this.stayStartTime) {
        Statistics.reportSceneStayTime(this.stayStartTime, this.stayEndTime, this.sceneUrl, 'back')
      }
    } else {
      if (this.stayStartTime) {
        Statistics.reportSceneStayTime(this.stayStartTime, this.stayEndTime, this.sceneUrl, 'navigate')
      }
    }
  }

  /**
   * 获取上一个页面传入的参数
   * @deprecated 除非自己想自定义默认值，否则不要直接用这个函数，请使用 this.params，默认添加了{}的默认值，并且和this.props, this.state 写法一致更容易理解
   */
  getParams (defaultValue) {
    return (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params)
      ? this.props.navigation.state.params
      : defaultValue
  }

  /**
   * 更新页面参数
   * @param params
   */
  setParams (params) {
    this.props.navigation.setParams({...this.getParams({}), ...params})
  }

  /**
   * 提供一个统一、快速的方法来设置redux state
   * @param sceneState - 需要更新的状态
   */
  setSceneState (sceneState) {
    if (RNEnv.isDev()) {
      const {
        moduleName,
        sceneName
      } = this.props
      const title = `[call stack] ${moduleName}-${sceneName}/setSceneState 更新字段：${Object.keys(sceneState || {}).join(', ')}`
      console.groupCollapsed(title)
      console.trace('call stack')
      console.groupEnd()
    }
    this.props.setSceneStateThatOnlyUseInner(sceneState)
  }

  /**
   * 截屏分享的接口
   * @param viewRef 需要截图的view数组，[this.refs['snapShotContainerView'], this.refs['snapShotBottomView']]
   * @param title 分享截图标题
   * @param url 分享截图二维码地址
   */
  onClickSnapShotShare (viewRef, title, url) {
    WeSnapShotSharePopup.show({
      viewRefList: viewRef,
      shareConfig: {
        title: title,
        url: url
      }
    })
    Statistics.reportEvent('ScreenShotShareOnClick', {
      shareOption: {
        title: title,
        url: url
      }
    })
  }

  // /**
  //  * 自定义页面实例数据所在的Key，需要自定义的可以覆盖这个静态方法。一般在详情页等模版页面进行设置，参数为跳转时携带的参数
  //  * @param {Object} params 跳转参数
  //  * @returns {string} 返回一个字符串Key（比如详情页可以返回产品编号、流水号等可以区分页面实例的值）
  //  */
  // static getSceneStateKey = (params = {}) => (undefined)
}
