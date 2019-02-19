/**
 * Created by erichua on 28/12/2017.
 */
import _ from 'lodash'
import { NavigationActions } from 'react-navigation'
import { generateRouteName, separateRouteName } from '../../utils'

const isDyLoad = require('./dyConfig.json').isDyLoad

/**
 * 路由
 * AppNavigator.<module>.<scene>(parameters)
 *
 * e.g.
 * AppNavigator.counter.CounterScene({count: 1})
 */
class AppNavigator {
  pendingLifecycleCallback = {}
  lifecycleCallback = {
    onPause: {},
    onResume: {}
  }
  // 动态的路由配置
  routersConfig = {}

  // 按需加载时的缓存
  _cachedModuleReducer = {}

  init (routersConfig) {
    let navigatorMethods = {}
    _.mapValues(routersConfig, (config, routeName) => {
      const {
        moduleName,
        sceneName
      } = separateRouteName(routeName)
      const func = params => {
        this._navigate(routeName, params, config)
      }
      func.toString = () => routeName

      navigatorMethods[moduleName] = navigatorMethods[moduleName] || {}
      navigatorMethods[moduleName][sceneName] = func
    })

    Object.assign(this, navigatorMethods)
    this.routersConfig = routersConfig
  }

  _getRouteNames () {
    return Object.keys(this.routersConfig)
  }

  // 下面两个方法是为了保证某些没考虑到的地方还是使用老的sceneName做跳转时能找到对应的routeName
  _getRealRouteNames (sceneNames) {
    return sceneNames.map((sceneName) => this._getRealRouteName(sceneName))
  }
  _getRealRouteName (sceneName) {
    const routeNames = this._getRouteNames()
    // 1. 标准的路由名称
    for (let i = 0, len = routeNames.length; i < len; i += 1) {
      let routeName = routeNames[i]
      if (routeName === sceneName) {
        return routeName
      }
    }
    return sceneName
  }

  addOnPauseCallback (sceneName, callback) {
    this.lifecycleCallback.onPause[sceneName] = callback
  }

  addOnResumeCallback (sceneName, callback) {
      // 首次添加
    this.lifecycleCallback.onResume[sceneName] = callback
    if (this.pendingLifecycleCallback[sceneName]) {
      callback(this.pendingLifecycleCallback[sceneName].fromScene, this.pendingLifecycleCallback[sceneName].toScene)
      delete this.pendingLifecycleCallback[sceneName]
    }
  }

  removeOnResumeCallback (sceneName) {
    this.lifecycleCallback.onResume[sceneName] && delete this.lifecycleCallback.onResume[sceneName]
    this.pendingLifecycleCallback[sceneName] && delete this.pendingLifecycleCallback[sceneName]
  }

  removeOnPauseCallback (sceneName) {
    this.lifecycleCallback.onPause[sceneName] && delete this.lifecycleCallback.onPause[sceneName]
  }

  addPendingLifecycleCallback (sceneName, info) {
    this.pendingLifecycleCallback[sceneName] = info
  }

  /**
   * 返回指定页面，并使用新页面替换
   *
   * 示例：
   * 1）假设页面路径可能为：
   * A -> C -> D
   * A -> B
   * 现在需要从 D 页面返回 B 页面，调用 goBackAndReplace(C, B)
   *
   * 2)假设页面路径如下，D 页面有多重可能的返回路径：
   * A -> C -> D
   * A -> E -> D
   * A -> B
   * 现在需要从 D 页面返回 B 页面，调用 goBackAndReplace([C, E], B)
   *
   * 3)假设页面路径如下，E 页面存在多重返回路径：
   * A -> B -> C -> D -> E
   * A -> C -> D -> E
   * A -> D -> E
   * 现需要从 E 页面返回 F 页面，把 A 和 E 之间的栈清理掉，变成：
   * A -> F -> E
   * 则调用 goBackAndReplace([B, C, D], F), B, C, D之间存在顺序上的优先级
   * @param routeNames 返回的目标页面名称，支持多个候选页面
   * @param {string|{routeName: string, params: any}} newRouter 新页面的路由
   *    可以是字符串（页面名称）或者是对象（必须包含routeName表示页面名称以及可选的页面参数 params）
   *
   * 实现参考：<https://github.com/react-navigation/react-navigation/issues/295>
   */
  goBackAndReplace (routeNames, newRouter) {
    this._goBackThenPush(routeNames, newRouter, true)
  }

  /**
   * 返回指定页面，然后跳转到新页面，如果第三个参数为true，则会使用新页面替换返回的那个页面
   *
   * 示例：
   * 1)假设页面路径如下，D 页面有多重可能的返回路径：
   * A -> C -> D
   * A -> E -> D
   * 变为：
   * A -> B
   * 现在需要从 D 页面返回 B 页面，调用 goBackThenPush(A, B)
   *
   * 2)假设页面路径如下，E 页面存在多重返回路径：
   * A -> B -> C -> D -> E
   * A -> F -> G -> H
   * A -> I -> J
   * 现需要从 E、H、J 页面返回到对应的 B、F、I 页面，然后跳转到统一的K页面，变成：
   * A -> B -> K
   * A -> F -> K
   * A -> I -> K
   * 则调用 goBackThenPush([B, F, I], K)
   *
   * @param {Array} routeNames - 要返回的路由名称
   * @param {string|{routeName: string, params: any}} newRouter - 返回后要到达的页面
   */
  goBackThenPush (routeNames, newRouter) {
    this._goBackThenPush(routeNames, newRouter, false)
  }

  /**
   * 内部函数，供goBackAndReplace和goBackThenPush调用
   * @private
   * @param routeNames
   * @param newRouter
   * @param isReplaceBackRouter - 决定返回的那个页面，是否需要替换掉
   */
  _goBackThenPush (routeNames, newRouter, isReplaceBackRouter) {
    if (!this.navigator || !routeNames || !newRouter) {
      console.warn('goBackAndReplace() receives invalid params')
      return
    }

    let _routeNames = []
    if (Array.isArray(routeNames)) {
      _routeNames = _.map(routeNames, value => String(value))
    } else {
      _routeNames = [String(routeNames)]
    }
    _routeNames = this._getRealRouteNames(_routeNames)

    const routerStack = this.navigator.props.navigation.state.routes || []
    let currentRouteIndex = -1
    for (let i = 0; i < _routeNames.length; i++) {
      let index = _.findIndex(routerStack, router => _routeNames[i] === router.routeName)
      if (index !== -1 && (currentRouteIndex === -1 || index < currentRouteIndex)) {
        currentRouteIndex = index
      }
    }

    const actions = []
    if (isReplaceBackRouter) {
      // 替换返回的那个页面
      for (let j = 0; j < currentRouteIndex; ++j) {
        actions.push(NavigationActions.navigate({...routerStack[j]}))
      }
    } else {
      // 保留返回的那个页面
      for (let j = 0; j <= currentRouteIndex; ++j) {
        actions.push(NavigationActions.navigate({...routerStack[j]}))
      }
    }

    if (_.isPlainObject(newRouter)) {
      if (newRouter.routeName) {
        newRouter.routeName = String(newRouter.routeName)
        actions.push(NavigationActions.navigate({...newRouter}))
      } else {
        console.error('router must has key "routeName"')
      }
    } else {
      newRouter = this._getRealRouteName(String(newRouter))
      actions.push(NavigationActions.navigate({ routeName: newRouter }))
    }
    const resetAction = NavigationActions.reset({index: actions.length - 1, actions})
    this.navigator.props.navigation.dispatch(resetAction)
  }

  /**
   * 返回指定页面
   *
   * 示例：
   * 1)假设页面堆栈为 A->B->C->D
   * * 在 D 页面调用 goBack() 返回 C
   * * 在 D 页面调用 goback('B') 返回 B
   *
   * 2) 假设页面 D 是一个公共页面，存在多种路径跳转过来：A->B->C->D, E->F->D
   * * 在 D 页面调用 goBack(['A', 'E'])，如果从 A 跳转过来返回 A，如果从 E 条转过来返回 E
   *
   * 提示：为了避免字面值，推荐使用 AppNavigator.home.HomeScene 替代 'HomeScene' 字面值
   *
   * @param routeNames 返回的目标页面名称，支持多个候选页面
   */
  goBack (routeNames) {
    if (!this.navigator) {
      console.warn('AppNavigation.navigator is null')
      return false
    }

    if (!routeNames) {
      const {
        goBack,
        state: {
          routes,
          index
        }
      } = this.navigator.props.navigation
      goBack(routes[index].key) // goback prev
      return true
    }

    let _routeNames = []
    if (Array.isArray(routeNames)) {
      _routeNames = _.map(routeNames, value => String(value))
    } else {
      _routeNames = [String(routeNames)]
    }
    _routeNames = this._getRealRouteNames(_routeNames)

    const routerIndex = this.navigator.props.navigation.state.index || 0
    const routerStack = this.navigator.props.navigation.state.routes || []
    const foundRoute = _routeNames.find(route => route === routerStack[routerIndex].routeName)
    if (foundRoute) {
      console.warn('your are already in routeName:', foundRoute)
      return false
    }
    let keyPrev = null
    for (let i = routerIndex - 1; i >= 0; i--) {
      keyPrev = routerStack[i + 1].key // keep the prev key to goback
      if (_routeNames.find(route => route === routerStack[i].routeName)) {
        break
      }
    }
    if (keyPrev === null) {
      console.warn('no routeName mached:', _routeNames)
      return false
    } else {
      this.navigator.props.navigation.goBack(keyPrev)
      return true
    }
  }

  /**
   * 获取当前的scene stack
   * @return {routes}
   */
  getCurrentRoutes () {
    if (!this.navigator) {
      console.warn('AppNavigation.navigator is null')
      return null
    }

    try {
      const {
        state: {
          routes
        }
      } = this.navigator.props.navigation
      if (Array.isArray(routes)) {
        return routes
      } else {
        return []
      }
    } catch (e) {
      return []
    }
  }

  /**
   * 获取当前的scene NavigationOptions
   * @return {routes}
   */
  getCurrentSceneGestureFlag () {
    let sceneNavigationOptions = this.getNavigationOptionsByNameInScene(this.currentScene.routeName)
    let routerNavigationOptions = this.getNavigationOptionsByNameInRouters(this.currentScene.routeName)

    if (sceneNavigationOptions && sceneNavigationOptions.gesturesEnabled === false) {
      return false
    } else if (routerNavigationOptions && routerNavigationOptions.gesturesEnabled === false) {
      return false
    } else {
      return true
    }
  }

  /**
   * 根据Scene，查询当前Scene的 navigationOptions
   * @return {routes}
   */
  getNavigationOptionsByNameInScene (routeName) {
    let ret = {}
    let screen

    if (isDyLoad) {
      if (this.routersConfig[routeName] && typeof this.routersConfig[routeName].getScreen === 'function') {
        screen = this.routersConfig[routeName].getScreen() // 获取当前Scene的实例
      }
    } else {
      if (this.routersConfig && this.routersConfig[routeName]) {
        screen = this.routersConfig[routeName].screen // 获取当前Scene的实例
      }
    }

    if (screen && screen.navigationOptions) { // 一部分Scene，为在Scene级别定义
      if (typeof screen.navigationOptions === 'function') {
        try {
          ret = screen.navigationOptions({navigation: {state: {params: {}}}})
        } catch (e) {
          console.log(e)
        }
      } else if (typeof screen.navigationOptions === 'object') {
        ret = screen.navigationOptions
      }
    }

    return ret
  }

  /**
   * 根据Scene，查询当前router文件中内配置的 NavigationOptions
   * @return {routes}
   */
  getNavigationOptionsByNameInRouters (routeName) {
    let ret = {}
    let navigationOptions

    if (this.routersConfig[routeName] && this.routersConfig[routeName].navigationOptions) {
      navigationOptions = this.routersConfig[routeName].navigationOptions
    }

    if (navigationOptions && typeof navigationOptions === 'function') {
      try {
        ret = navigationOptions({navigation: {state: {params: {}}}})
      } catch (e) {
        console.log(e)
      }
    } else if (typeof navigationOptions === 'object') {
      ret = navigationOptions
    }
    return ret
  }

  isSceneInStack (routeNames) {
    let _routeNames = []
    if (Array.isArray(routeNames)) {
      _routeNames = _.map(routeNames, value => String(value))
    } else {
      _routeNames = [String(routeNames)]
    }
    _routeNames = this._getRealRouteNames(_routeNames)

    const routerStack = this.navigator.props.navigation.state.routes || []
    let currentRouteIndex = _.findLastIndex(routerStack, router => _routeNames.find(routeName => routeName === router.routeName))
    return currentRouteIndex !== -1
  }

  setParams (params) {
    if (!this.navigator) {
      console.warn('AppNavigation.navigator is null')
      return
    }
    this.navigator.props.navigation.setParams(params)
  }

  getParams () {
    return this.navigator.navigation.state.params
  }

  from () {
    const tabIndex = this.navigator.props.navigation.state.index || 0
    const tabStack = this.navigator.props.navigation.state.routes || []
    return tabStack[tabIndex - 1] ? tabStack[tabIndex - 1].routeName : ''
  }

  isCurrentSceneMatch (targetScene) {
    const targetSceneName = typeof targetScene === 'function' ? targetScene.toString() : targetScene
    const routerStack = _.get(this, 'navigator.props.navigation.state.routes', [])
    return routerStack.length > 1 && routerStack[routerStack.length - 1].routeName === targetSceneName
  }

  _navigate (routeName, params, router) {
    if (!this.navigator) {
      console.warn('WeNavigation.navigator is null')
      return
    }

    // 已登录并且已开户的情况，或者支持客人态访问的页面，不关心登录态
    this.navigator.props.navigation.navigate(routeName, params)
  }
}

const appNavigator = new AppNavigator()

if (isDyLoad) {
  // Object.keys(require('./dynamic/dyRouterRequire').default).forEach(moduleKey => {
  //   Object.defineProperty(appNavigator, moduleKey, {
  //     get: function () {
  //       const moduleName = moduleKey
  //       let moduleReducer
  //       if (!this._cachedModuleReducer[moduleName]) {
  //         // console.time('DyLoadModule ' + moduleKey)
  //         if (require('./dynamic/dyReducerRequire').default[moduleName]) {
  //           moduleReducer = require('./dynamic/dyReducerRequire').default[moduleName]()
  //         }
  //
  //         // 更新了reducer，需要replace一下
  //         if (this.store) {
  //           const createRootReducer = require('../../core/reducer').default
  //           this.store.replaceReducer(createRootReducer(undefined, moduleName, moduleReducer))
  //         }
  //
  //         // console.timeEnd('DyLoadModule ' + moduleKey)
  //         this._cachedModuleReducer[moduleName] = moduleReducer
  //       }
  //
  //       const dyNavMethods = {}
  //       dyNavMethods[moduleName] = {}
  //       if (require('./dynamic/dyRouterRequire').default[moduleName]) {
  //         _.mapValues(require('./dynamic/dyRouterRequire').default[moduleName](), (router, sceneName) => {
  //           const routeName = generateRouteName(moduleName, sceneName)
  //           appNavigator.routersConfig[routeName] = router
  //           const func = params => this._navigate(routeName, params, router)
  //           func.toString = () => routeName
  //           dyNavMethods[moduleName][sceneName] = func
  //         })
  //       }
  //       return dyNavMethods[moduleName]
  //     }
  //   })
  // })
}
export default appNavigator
