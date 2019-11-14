import AppNavigator from './AppNavigator'
import _ from 'lodash'
import URLUtils from '../utils/URLUtils'

export default (state, nextState, action) => {
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

  const oldTopSceneState = getCurrentRouteName(state)
  const newTopSceneState = getCurrentRouteName(nextState)

  let fromRouteName, toRouteName, fromSceneKey, toSceneKey

  if (!oldTopSceneState || !oldTopSceneState.routeName) {
    fromRouteName = null
    fromSceneKey = null
  } else {
    fromRouteName = oldTopSceneState.routeName
    fromSceneKey = oldTopSceneState.key
  }
  toRouteName = newTopSceneState.routeName
  toSceneKey = newTopSceneState.key

  if ((AppNavigator.lastScene === undefined && AppNavigator.currentScene === undefined && fromSceneKey === null) ||
    (!!fromSceneKey && !!toSceneKey && fromSceneKey !== toSceneKey)) {
    // 从action里面拿数据，不要从state里面拿，state里面可能是用setParams修改过的
    let currentParams = _.get(action, 'params', {})
    if (action.type === 'Navigation/RESET') {
      currentParams = _.get(action.actions[0], 'params', {})
    }
    // 过滤参数
    const lastSceneURL = AppNavigator.currentSceneURL || 'null'
    const currentSceneURL = URLUtils.appendParams(toRouteName || 'null', currentParams)
    // Statistics.reportPageEnd(lastSceneURL)
    // Statistics.reportPageStart(currentSceneURL)

    if (fromSceneKey && fromSceneKey !== toSceneKey) {
      //* 如果有注册onPause，则调用
      if (_.isFunction(AppNavigator.lifecycleCallback.onPause[fromSceneKey])) {
        AppNavigator.lifecycleCallback.onPause[fromSceneKey] && AppNavigator.lifecycleCallback.onPause[fromSceneKey](fromRouteName, toRouteName)
      }
    }

    if (fromSceneKey && _.isFunction(AppNavigator.lifecycleCallback.onResume[toSceneKey])) {
      AppNavigator.lifecycleCallback.onResume[toSceneKey](fromRouteName, toRouteName)
    } else {
      AppNavigator.addPendingLifecycleCallback(toSceneKey, { fromScene: fromRouteName, toScene: toRouteName })
    }

    AppNavigator.lastScene = oldTopSceneState || {}
    AppNavigator.currentScene = newTopSceneState || {}

    AppNavigator.lastSceneURL = lastSceneURL
    AppNavigator.currentSceneURL = currentSceneURL
    // console.log('currentScene change')
  }
  const navTimeConsuming = {}
  if (AppNavigator.currentScene && AppNavigator.currentScene.routeName) {
    const routeName = AppNavigator.currentScene.routeName
    if (action.type === 'Navigation/NAVIGATE') {
      navTimeConsuming[routeName] = {
        startTime: new Date().getTime()
      }
    }
    if (action.type === 'Navigation/COMPLETE_TRANSITION' &&
      navTimeConsuming[routeName] &&
      navTimeConsuming[routeName].startTime) {
      const endTime = new Date().getTime()
      navTimeConsuming[routeName].endTime = endTime

      console.log(routeName + ' 切换耗时 ' + (endTime - navTimeConsuming[routeName].startTime))
      // Statistics.reportTimeConsuming(routeName, navTimeConsuming[routeName].startTime, endTime)
      delete navTimeConsuming[routeName]
    }
  }
}
