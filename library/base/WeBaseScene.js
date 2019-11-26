/**
 * 负责管理Scene的生命周期，提供统一的Scene上下文
 * Created by erichua on 27/12/2017.
 */
import { Component } from 'react'
import {
  Keyboard
} from 'react-native'
import AppNavigator from '../navigation/AppNavigator'
import _ from 'lodash'
import { generateRouteName } from '../navigation/NavigationUtils'
import RNEnv from '../utils/RNEnv'
import moment from 'moment'
import Statistics from '../statistics/Statistics'
import SceneTraversal from '../qualityTools/SceneTraversal'

export default class WeBaseScene extends Component {
  constructor () {
    super(...arguments)

    delete this.navigation

    const originComponentWillMount = this.componentWillMount
    if (originComponentWillMount) {
      this.componentWillMount = () => {
        const instance = this
        if (RNEnv.isDev()) {
          // const { moduleName = '', sceneName = '' } = this.props || {}
          // const startTime = new Date().getTime()
          const result = originComponentWillMount.apply(instance, ...arguments)
          this._componentWillMountBase.apply(instance, ...arguments)
          // PerformanceUtils.consoleWarning(startTime, new Date().getTime(), `${moduleName}-${sceneName}-componentWillMount`)
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
    ['componentWillMount', 'componentWillUnmount', 'onResume', 'onPause'].forEach(methodName => {
      const origin = this[methodName]
      const instance = this
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
    return this._getParams({})
  }

  componentWillMount () {}

  componentWillUnmount () {}

  componentDidUpdate () {
      this._setTraversalTimer()
  }

  // Invoked when this scene become visible again. It won't be invoked at the first time
  onResume (fromScene, toScene) {}

  onPause (fromScene, toScene) {}

  onIdle () {
      const { moduleName, sceneName } = this.props
      SceneTraversal.runTest(moduleName, sceneName, this)
  }

  /**
   * @private
   */
  _componentWillMountBase () {
    const sceneKey = this.props.navigation.state.key
    // 处理生命周期, 添加timeout是为了不要阻塞生命周期函数，导致切页卡顿
    AppNavigator.addOnPauseCallback(sceneKey,
      (from, to) => setTimeout(() => this.onPause.bind(this)(from, to), 0))
    AppNavigator.addOnResumeCallback(sceneKey,
      (from, to) => setTimeout(() => this.onResume.bind(this)(from, to), 0))
    this.isUnmounted = false

    // TODO 这里要确定一下App的前后台切换是否要纳入onResume和onPause
    // AppState.addEventListener('change', this.handleAppStateChange.bind(this))
  }

  /**
   * @private
   */
  _componentWillUnmountBase () {
    const sceneKey = this.props.navigation.state.key
    AppNavigator.removeOnPauseCallback(sceneKey)
    AppNavigator.removeOnResumeCallback(sceneKey)

    // TODO 这里要确定一下App的前后台切换是否要纳入onResume和onPause
    // AppState.removeEventListener('change', this.handleAppStateChange.bind(this))
  }

  // Invoked when this scene become visible again. It won't be invoked at the first time
  /**
   * @private
   */
  _onResumeBase (fromScene, toScene) {
    const sceneKey = this.props.navigation.state.key
    const sceneDetailName = generateRouteName(_.get(this, 'props.moduleName', ''), _.get(this, 'props.sceneName', ''))
    console.log(`🐈${sceneDetailName}(${sceneKey})`, 'onResume', `${fromScene} --> ${toScene}`)

    this.stayStartTime = moment()
    this.sceneUrl = AppNavigator.currentSceneURL

    this._setTraversalTimer()
  }

  /**
   * @private
   */
  _onPauseBase (fromScene, toScene) {
    Keyboard.dismiss()
    const sceneKey = this.props.navigation.state.key
    const sceneDetailName = generateRouteName(_.get(this, 'props.moduleName', ''), _.get(this, 'props.sceneName', ''))
    console.log(`🐈${sceneDetailName}(${sceneKey})`, 'onPause', `${fromScene} --> ${toScene}`)

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

    if (this.timer) {
        clearTimeout(this.timer)
    }
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
   * 获取上一个页面传入的参数
   * @deprecated 除非自己想自定义默认值，否则不要直接用这个函数，请使用 this.params，默认添加了{}的默认值，并且和this.props, this.state 写法一致更容易理解
   */
  _getParams (defaultValue) {
    return (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params)
      ? this.props.navigation.state.params
      : defaultValue
  }

  /**
   * 更新页面参数
   * @param params
   */
  setParams (params) {
    this.props.navigation.setParams({ ...this._getParams({}), ...params })
  }

  _setTraversalTimer () {
      if (this.timer) {
          clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
          this.onIdle()
      }, 3000)
  }
}
