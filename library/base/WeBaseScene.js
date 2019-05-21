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

export default class WeBaseScene extends Component {
  constructor () {
    super(...arguments);

    // 包装原来的生命周期函数，在实例创建的时候完成替换，将原来webasescene中生命周期执行的动作放入_<methodname>Base中执行，
    // 原来的函数内容清空，保证具体的scene无论是否有super，webasescene中注册回调的方法始终都能执行
    ['componentWillMount', 'componentWillUnmount', 'onResume', 'onPause'].forEach(methodName => {
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
    return this._getParams({})
  }

  componentWillMount () {}

  componentWillUnmount () {}

  // Invoked when this scene become visible again. It won't be invoked at the first time
  onResume (fromScene, toScene) {}

  onPause (fromScene, toScene) {}

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
    console.log(`${sceneDetailName}(${sceneKey})`, 'onResume', `${fromScene} --> ${toScene}`)
  }

  /**
   * @private
   */
  _onPauseBase (fromScene, toScene) {
    Keyboard.dismiss()
    const sceneKey = this.props.navigation.state.routeName
    const sceneDetailName = generateRouteName(_.get(this, 'props.moduleName', ''), _.get(this, 'props.sceneName', ''))
    console.log(`${sceneDetailName}(${sceneKey})`, 'onPause', `${fromScene} --> ${toScene}`)
  }

  // handleAppStateChange (nextAppState) {
  //   if (AppState.currentState && AppState.currentState.match(/inactive|background/) && nextAppState === 'active') {
  //     this.stayStartTime = moment()
  //   } else if (AppState.currentState && AppState.currentState.match(/inactive|active/) && nextAppState === 'background') {
  //     this.stayEndTime = moment()
  //     if (AppNavigator.currentScene && this.sceneUrl === AppNavigator.currentSceneURL) {
  //       if (this.stayStartTime) {
  //         // TODO 页面停留时长上报
  //         Statistics.reportSceneStayTime(this.stayStartTime, this.stayEndTime, this.sceneUrl, 'home')
  //       }
  //     }
  //   }
  // }


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
}
