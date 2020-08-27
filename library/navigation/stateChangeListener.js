import AppNavigator from './AppNavigator'
import _ from 'lodash'
import URLUtils from '../utils/URLUtils'
import SceneTraversal from '../qualityTools/SceneTraversal'
import TridentStat from '../statistics/TridentStat'

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

  let fromRouteName, fromSceneKey

  if (!oldTopSceneState || !oldTopSceneState.routeName) {
    fromRouteName = null
    fromSceneKey = null
  } else {
    fromRouteName = oldTopSceneState.routeName
    fromSceneKey = oldTopSceneState.key
  }
  const toRouteName = newTopSceneState.routeName
  const toSceneKey = newTopSceneState.key

  // @@redux/INIT may triggered multiple times
  if (action.type === '@@redux/INIT' && AppNavigator.currentSceneURL === undefined) {
    if (fromSceneKey && _.isFunction(AppNavigator.lifecycleCallback.onResume[toSceneKey])) {
      AppNavigator.lifecycleCallback.onResume[toSceneKey]('null', toRouteName)
    } else {
      AppNavigator.addPendingLifecycleCallback(toSceneKey, { fromScene: 'null', toScene: toRouteName })
    }

    const lastSceneURL = 'null'
    AppNavigator.lastSceneURL = lastSceneURL

    const currentSceneURL = URLUtils.appendParams(toRouteName || 'null')
    AppNavigator.currentSceneURL = currentSceneURL

    // set topScene to currentScene
    AppNavigator.lastScene = oldTopSceneState || {}
    AppNavigator.currentScene = newTopSceneState || {}

    TridentStat.emitStatEvent({
      type: TridentStat.StatType.sceneChange,
      ts: new Date().getTime(),
      payload: {
        from: lastSceneURL,
        to: currentSceneURL
      }
    })
  }

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
    TridentStat.emitStatEvent({
      type: TridentStat.StatType.sceneChange,
      ts: new Date().getTime(),
      payload: {
        from: lastSceneURL,
        to: currentSceneURL
      }
    })

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

      // console.log(routeName + ' 切换耗时 ' + (endTime - navTimeConsuming[routeName].startTime))

      // Statistics.reportTimeConsuming(routeName, navTimeConsuming[routeName].startTime, endTime)
      delete navTimeConsuming[routeName]
    }

    // Traversal
    if (action.type === 'Navigation/NAVIGATE') {
      if (action.routeName !== 'DrawerOpen' && action.routeName !== 'DrawerClose') {
        const names = action.routeName && action.routeName.split('/')
        if (names && names.length === 2) {
          SceneTraversal.onNavigate(names[0], names[1])
        }
      } else if (action.routeName === 'DrawerOpen') {
        SceneTraversal.onDrawerOpen()
      }
    } else if (action.type === 'Navigation/BACK') {
      SceneTraversal.onBack()
    }
  }
}
