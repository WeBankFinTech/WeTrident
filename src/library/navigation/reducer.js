import URLUtils from '../../utils/URLUtils'
import { MyStackNavigator } from './WeNavigator'
import AppNavigator from './AppNavigator'
import _ from 'lodash'
import {PopupStub} from '@unpourtous/react-native-popup-stub'

// gets the current screen from navigation state
const getCurrentRouteName = (navigationState) => {
  if (!navigationState) {
    return null
  }
  const findCurrentRoute = (navigationState) => {
    if (navigationState.index !== undefined) {
      return findCurrentRoute(navigationState.routes[navigationState.index])
    }
    return navigationState
  }
  return findCurrentRoute(navigationState)
}

const navTimeConsuming = {}
export default (entryScene) => {
  const entryAction = MyStackNavigator.router.getActionForPathAndParams(entryScene)
  const initialState = MyStackNavigator.router.getStateForAction(entryAction)
  return (state, action) => {
    const nextState = MyStackNavigator.router.getStateForAction(action, state || initialState)
    // TODO 这里都是生命周期的处理

    // if (!action.type || !action.type.startsWith('Navigation/')) {
    //   return nextState || state
    // }

    // const oldTopSceneState = getCurrentRouteName(state)
    // const newTopSceneState = getCurrentRouteName(nextState)
    //
    // let fromRouteName, toRouteName, fromSceneKey, toSceneKey
    //
    // if (!oldTopSceneState || !oldTopSceneState.routeName) {
    //   fromRouteName = null
    //   fromSceneKey = null
    // } else {
    //   fromRouteName = oldTopSceneState.routeName
    //   fromSceneKey = oldTopSceneState.key
    // }
    // toRouteName = newTopSceneState.routeName
    // toSceneKey = newTopSceneState.key
    //
    // if ((AppNavigator.lastScene === undefined && AppNavigator.currentScene === undefined && fromSceneKey === null) ||
    //   (!!fromSceneKey && !!toSceneKey && fromSceneKey !== toSceneKey)) {
    //   // 从action里面拿数据，不要从state里面拿，state里面可能是用setParams修改过的
    //   let currentParams = _.get(action, 'params', {})
    //   if (action.type === 'Navigation/RESET') {
    //     currentParams = _.get(action.actions[0], 'params', {})
    //   }
    //   // 过滤参数
    //   const lastSceneURL = AppNavigator.currentSceneURL || 'null'
    //   const currentSceneURL = URLUtils.appendParams(toRouteName || 'null', currentParams)
    //
    //   if (fromSceneKey && fromSceneKey !== toSceneKey) {
    //     //* 如果有注册onPause，则调用
    //     if (_.isFunction(AppNavigator.lifecycleCallback.onPause[fromSceneKey])) {
    //       AppNavigator.lifecycleCallback.onPause[fromSceneKey] && AppNavigator.lifecycleCallback.onPause[fromSceneKey](fromRouteName, toRouteName)
    //     }
    //
    //     // WARNING 这里是不应该去改Popup的状态的，但是不这样处理，可能会出现页面跳转了，Popup还在的情况，
    //     // 所以临时先在跳转时去掉所有的Popup, 终极解决需要Popup里面支持状态保存和回复，包括页面级别的状态和全局的状态
    //     const globalPopups = new Map()
    //     PopupStub.stub.state.popups && PopupStub.stub.state.popups.forEach((v, k) => {
    //       if (v.scope === 'global') {
    //         globalPopups.set(k, v)
    //       }
    //     })
    //     PopupStub.stub && PopupStub.stub.setState({
    //       popups: globalPopups
    //     })
    //   }
    //
    //   if (fromSceneKey && _.isFunction(AppNavigator.lifecycleCallback.onResume[toSceneKey])) {
    //     AppNavigator.lifecycleCallback.onResume[toSceneKey](fromRouteName, toRouteName)
    //   } else {
    //     AppNavigator.addPendingLifecycleCallback(toSceneKey, {fromScene: fromRouteName, toScene: toRouteName})
    //   }
    //
    //   AppNavigator.lastScene = oldTopSceneState || {}
    //   AppNavigator.currentScene = newTopSceneState || {}
    //
    //   AppNavigator.lastSceneURL = lastSceneURL
    //   AppNavigator.currentSceneURL = currentSceneURL
    //   console.log('currentScene change')
    // }
    return nextState
  }
}
