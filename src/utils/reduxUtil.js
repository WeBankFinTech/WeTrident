/**
 * Created by erichua on 08/11/2017.
 */
import React from 'react'
import {
  createActions,
  handleActions
} from 'redux-actions'
import { connect } from 'react-redux'
import _ from 'lodash'
import RNEnv from './RNEnv'
import PropTypes from 'prop-types'
// import {NotifyHelper} from 'apps/webankPro/serviceHelper'
const URL = require('url')

const GLOBAL_STATE_KEY = 'container'
const GLOBAL_NAVIGATION_KEY = 'navigation'
const MODULE_STATE_KEY = 'ModulePrivate'
const MODULE_SCENE_SEPARATOR = '-'
const SCENE_ACTION_SEPARATOR = '/'

function createSceneConnect (config = {}) {
  const {
    moduleName,
    sceneName,
    initialState = {},
    actions = {},
    asyncActions = () => ({}),
    moduleActions = {},
    globalActions = {},
    reducers = {},
    mapSceneState = state => state,
    mapModuleState = state => ({}),
    mapGlobalState = state => ({}),
    autoResetState = true
  } = config

  // action 命名空间
  const namespace = createSceneActionNS(moduleName, sceneName)
  const TAG = `[createSceneConnect_${namespace}]`

  checkActionReducerName(actions, reducers, namespace)

  // 加上一些默认的action、reducer
  if (autoResetState) {
    if (!actions.resetState) {
      actions.resetState = v => v
    }
    if (!reducers.resetState) {
      reducers.resetState = (state, action) => ({...initialState})
    }
  }
  if (!actions.setSceneStateThatOnlyUseInner) {
    actions.setSceneStateThatOnlyUseInner = sceneState => sceneState
    reducers.setSceneStateThatOnlyUseInner = (state, action) => ({...state, ...action.payload})
  }

  // add namespace for every action
  const _actions = createActions({
    [namespace]: {
      ...actions
    }
  })[_.camelCase(namespace)]

  // combine reduces into a single one
  const _reducer = handleActions({
    // add namespace for every reducer
    ..._.mapKeys(reducers, (value, key) => namespace + SCENE_ACTION_SEPARATOR + key)
  }, initialState)
  const getRealKey = (key) => `_scene_key_${key}`
  const realReducer = (state = initialState, action) => {
    if (
      action.payload &&
      action.payload.__namespace__ === namespace
    ) {
      if (action.payload.__stateKey__) {
        const stateKey = getRealKey(action.payload.__stateKey__)
        // console.log(TAG, '发出了带分区key的action', stateKey, state, action)
        let stateByKey = _.get(state, stateKey, initialState)
        const newSubState = _reducer(stateByKey, {
          ...action,
          payload: action.payload.payload
        })
        return {
          ...state,
          [stateKey]: newSubState
        }
      } else {
        // 分区Key为undefined，则走老得逻辑
        return _reducer(state, {
          ...action,
          payload: action.payload.payload
        })
      }
    } else {
      // console.log(TAG, '发出了不带分区key的action跟以前一样的处理', action, state)
      return _reducer(state, action)
    }
  }

  // origin component => a new component
  return (Scene) => {
    let instanceCount1 = 0 // 当前页面实例存在的个数，以constructor为起点
    let instanceCount2 = 0 // 当前页面实例存在的个数，以DidMount为起点

    // 拦截 Scene 做一些处理
    const HookScene = class extends React.Component {
      static childContextTypes = {
        moduleName: PropTypes.string,
        sceneName: PropTypes.string
      }

      constructor (props) {
        super(props)
        instanceCount1 += 1
      }

      componentWillMount () {
        if (autoResetState === true) {
          this.props.resetState()
        }
      }
      componentDidMount () {
        // instanceCount2 += 1
        // // 组装页面通知需要的key
        // let pathname = `${moduleName}/${sceneName}`
        // let query = {}
        // if (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params) {
        //   query = this.props.navigation.state.params
        // }
        // let notifyKey = URL.format({pathname, query})

        // TODO 页面切换通知
        // setTimeout(() => {
        //   NotifyHelper.triggerNotify(notifyKey)
        // }, 100)
      }
      componentWillUnmount () {
        // instanceCount1 -= 1
        // instanceCount2 -= 1
        //
        // let routeNames = AppNavigator.getCurrentRoutes()
        // let routeStack = 'unknow'
        // if (Array.isArray(routeNames)) {
        //   routeStack = routeNames.map((route) => route && route.routeName).join(',')
        // }
        // let moreDetail = `${instanceCount1}|${instanceCount2}|${moduleName}/${sceneName}|${routeStack}`
      }

      // 为下层组件提供感知当前上下文的能力
      getChildContext () {
        return {
          sceneName,
          moduleName
        }
      }

      render () {
        // 这里可以根据需求进一步扩展，例如过滤、转换、新增 props 等
        return (
          <Scene {...this.props} />
        )
      }
    }

    // 增加一层，动态分区，支持每一个Scene实例有自己的state，不覆盖
    const ProxyScene = class extends React.Component {
      constructor (props) {
        // console.log(TAG, 'constructor', props)
        super(props)
        this.stateKey = this._getStateKey()
        this.CustomScene = this._getCustomScene(this.stateKey, HookScene)
      }
      componentWillUnmount () {
      }
      _getStateKey () {
        const DEFAULT_KEY = '__default__'
        let stateKey
        if (typeof Scene.getSceneStateKey === 'function') {
          const params = this.props.navigation &&
            this.props.navigation.state &&
            this.props.navigation.state.params

          let customStateKey
          try {
            customStateKey = Scene.getSceneStateKey(params)
          } catch (e) {
            console.log(e)
          }
          if (typeof customStateKey !== 'string') {
            stateKey = DEFAULT_KEY
            console.warn(TAG, '数据分区的Key必须为非空字符串，当前给的类型为：' + (typeof customStateKey) + '，退化为使用默认的Key：' + DEFAULT_KEY)
          } else if (!customStateKey) {
            stateKey = DEFAULT_KEY
            console.warn(TAG, '自定义的分区Key为空字符串，退化为使用默认的Key：' + DEFAULT_KEY)
          } else {
            stateKey = customStateKey
          }
        }
        // console.log(TAG, ROUTE_NAME + '页面实例使用的分区Key为：' + stateKey)
        return stateKey
      }

      _getCustomScene (stateKey, Scene) {
        const mapStateToProps = state => {
          // 如果分区stateKey为undefined，则使用以前的数据区，没有分区
          let sceneState = _.get(state, `modules.${moduleName}.${sceneName}`, {})
          if (stateKey !== undefined) {
            sceneState = _.get(sceneState, getRealKey(stateKey), initialState)
          }
          const moduleState = _.get(state, `modules.${moduleName}.${MODULE_STATE_KEY}`, {})
          const globalState = _.get(state, `${GLOBAL_STATE_KEY}`, {})
          // 注意层叠顺序
          const props = {
            moduleName,
            sceneName,
            ...mapGlobalState(globalState),
            ...mapModuleState(moduleState),
            ...mapSceneState(sceneState)
          }
          // console.log(TAG, 'StateToProps', props)
          return props
        }

        // 包一层payload，带上分区Key和命名空间
        const newActionCreators = _.mapValues(_actions, (actionCreator) => (...args) => {
          const action = actionCreator(...args)
          // console.log(TAG, '本Action要被套上分区Key', action)
          return {
            ...action,
            payload: {
              payload: action.payload,
              __namespace__: namespace,
              __stateKey__: stateKey
            }
          }
        })
        // 注意层叠顺序
        const mapDispatchToProps = {
          ...globalActions,
          ...moduleActions,
          ...newActionCreators,
          ...decorateAsyncActions(namespace, asyncActions(newActionCreators))
        }

        return connect(mapStateToProps, mapDispatchToProps)(Scene)
      }

      render () {
        const CustomScene = this.CustomScene
        return (
          <CustomScene {...this.props} />
        )
      }
    }

    Object.assign(ProxyScene, Scene)
    Object.assign(ProxyScene, {
      sceneName,
      moduleName,
      reducer: realReducer,
      toString: function () { return sceneName }
    })
    return ProxyScene
  }
}

function createModuleConnect (config) {
  const {
    moduleName,
    initialState = {},
    actions = {},
    asyncActions = () => ({}),
    reducers = {}
  } = config

  // module 的 state key 为固定值
  const sceneName = MODULE_STATE_KEY

  // action 命名空间
  const namespace = createSceneActionNS(moduleName, sceneName)

  checkActionReducerName(actions, reducers, namespace)

  // 创建带命名空间的同步 actions
  const _actions = createActions({
    [namespace]: {
      ...actions
    }
  })[_.camelCase(namespace)]

  // 将传入的 reducers 合并为一个 reducer
  const _reducer = handleActions({
    ..._.mapKeys(reducers, (value, key) => namespace + SCENE_ACTION_SEPARATOR + key)
  }, initialState)

  // origin component => a new component
  return (module) => {
    const connectedModule = {
      moduleName,
      actions: {..._actions, ...decorateAsyncActions(namespace, asyncActions(_actions))},
      reducer: _reducer,
      toString: function () { return sceneName }
    }
    return connectedModule
  }
}

/**
 * 创建全局的 connect 函数
 *
 * container 目录同时肩负了两种职责：作为 Scene；作为全局状态，所以要分开处理
 * 如果 connect 传入的是 AppContainer，视作 Scene 处理
 * 如果 connect 传入的是空，视作全局状态处理
 *
 * @param {object} config
 */
function createGlobalConnect (config = {}) {
  const {
    initialState = {},
    actions = {},
    asyncActions = () => ({}),
    reducers = {},
    mapGlobalState = state => ({})
  } = config

  // global 的 state key 为固定值
  const moduleName = GLOBAL_STATE_KEY

  // action 命名空间
  const namespace = createSceneActionNS(moduleName)

  // 创建带命名空间的同步 actions
  const _actions = createActions({
    [namespace]: {
      ...actions
    }
  })[_.camelCase(namespace)]

  // 将传入的 reducers 合并为一个 reducer
  const _reducer = handleActions({
    ..._.mapKeys(reducers, (value, key) => namespace + SCENE_ACTION_SEPARATOR + key)
  }, initialState)

  return (container) => {
    let connectedContainer = null
    if (container) {  // container 作为 Scene
      // map local state and shared state into the property named 'props' of the input component
      const _mapStateToProps = _state => {
        const globalState = _state[moduleName]
        const props = {
          ...mapGlobalState(globalState)
        }
        return props
      }

      const _mapDispatchToProps = {..._actions, ...decorateAsyncActions(namespace, asyncActions(_actions))}

      connectedContainer = connect(_mapStateToProps, _mapDispatchToProps)(container)
    } else {    // container 作为全局状态容器
      connectedContainer = {}
    }

    Object.assign(connectedContainer, {
      moduleName,
      actions: {..._actions, ...decorateAsyncActions(namespace, asyncActions(_actions))},
      reducer: _reducer,
      toString: () => moduleName
    })
    return connectedContainer
  }
}

function createComponentConnect (config = {}) {
  const {
    mapGlobalState = state => ({}),
    globalActions = {},
    mapNavigationState = state => ({})
  } = config

  // global 的 state key 为固定值
  const moduleName = GLOBAL_STATE_KEY

  return (component) => {
    // map local state and shared state into the property named 'props' of the input component
    const _mapStateToProps = _state => {
      const globalState = _state[moduleName]
      const navigationState = _state[GLOBAL_NAVIGATION_KEY]
      const props = {
        ...mapGlobalState(globalState),
        ...mapNavigationState(navigationState)
      }
      return props
    }

    const _mapDispatchToProps = {
      ...globalActions
    }

    return connect(_mapStateToProps, _mapDispatchToProps)(component)
  }
}

/**
 * 抽离命名空间规则
 * @param moduleName
 * @param sceneName
 * @returns {string}
 */
function createSceneActionNS (moduleName, sceneName) {
  if (!moduleName) {
    console.warn('moduleName should not be empty')
  }
  if (sceneName) {
    return `${moduleName}${MODULE_SCENE_SEPARATOR}${sceneName}`
  } else {
    return `${moduleName}`
  }
}

/**
 * 为异步actions增加type，方便查看日志
 * @param {string} namespace
 * @param {object} actions
 */
function decorateAsyncActions (namespace, actions) {
  if (!RNEnv.isDev()) return actions

  return _.mapValues(actions, (actionsCreator, key) => {
    return (...args) => {
      const asyncAction = actionsCreator(...args)
      if (asyncAction.type) {
        asyncAction.type = namespace + SCENE_ACTION_SEPARATOR + key + `(${asyncAction.type})`
      } else {
        asyncAction.type = namespace + SCENE_ACTION_SEPARATOR + key
      }
      return asyncAction
    }
  })
}

/**
 * 检查 action 和 reducer 的名称是否对应
 * action 经过 redux-action 处理后使用 cameCase 风格重命名，可能会导致与 reducer 名称不一致，提前警告这种情况
 * @param {object} actions
 * @param {object} reducers
 * @param {string=''} location
 */
function checkActionReducerName (actions, reducers, location = '') {
  if (!RNEnv.isDev()) return

  const actionNames = Object.keys(actions)
  const reducerNames = Object.keys(reducers)

  actionNames.forEach(actionName => {
    const camelCaseActionName = _.camelCase(actionName)
    if (reducerNames.indexOf(camelCaseActionName) < 0) {
      // 下一个 event loop 执行以保证警告消息在UI渲染后显示
      setTimeout(() => {
        if (actionName === 'setSceneStateThatOnlyUseInner') {
          console.error('名称为setSceneStateThatOnlyUseInner的action为内部action，外面不允许使用')
        }
        if (actionName === camelCaseActionName) {
          // console.error(`action '${actionName}' miss corresonding reducer (${location})`)
          console.warn(`action '${actionName}' miss corresonding reducer (${location})`)
        } else {
          // console.error(`action '${camelCaseActionName}'(origin: '${actionName}') miss corresonding reducer (${location})`)
          console.warn(`action '${camelCaseActionName}'(origin: '${actionName}') miss corresonding reducer (${location})`)
        }
      })
    }
  })
}

export {
  createComponentConnect,
  createSceneConnect,
  createModuleConnect,
  createGlobalConnect
}
