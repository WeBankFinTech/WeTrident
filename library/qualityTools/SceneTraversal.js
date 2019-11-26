/**
 * Created by williamdeng on 2019/8/16.
 */
import {
  findNodeHandle
} from 'react-native'
import ReactNativeComponentTree from 'react-native/Libraries/Renderer/shims/ReactNativeComponentTree'
import _ from 'lodash'
import { AppNavigator } from '@webank/trident'
const md5 = require('md5')

const TabConfig = {
  // home: {
  //   HomeScene: []
  // }
}
const InitialScene = {
  moduleName: 'example',
  sceneName: 'DemoScene'
}
const InitialTab = {}

class SceneTraversal {
  constructor () {
    this.isVisit = {}
    this.preorder = {}
    this.current = {}
    this.activeTab = {}
    this.whitelist = null
    this.blacklist = null
    this.traversing = false
    this.dataRecorder = new DataRecorder(this._onDataRecorderMessage.bind(this))
    this.isPrepared = false
    this.cacheAction = null
    this.replay = false
    this.finishMarkOnBack = false

    global.ErrorUtils.setGlobalHandler((error, isFatal) => this.recordError(error))
  }

  _getNodeKey (node, rootNode) {
    let attr = _.pick(node, ['index', 'key', 'tag'])
    let type = node.type
    if (_.isFunction(type) && _.isString(type.displayName)) {
      attr.type = type.displayName
    } else if (_.isFunction(type) && _.isString(type.name)) {
      attr.type = type.name
    } else if (_.isString(type)) {
      attr.type = type
    }
    attr._className = node.stateNode && node.stateNode.constructor.name || ''
    attr._parentKey = node !== rootNode && node.return && node.return._debugSource || ''

    let memoizedProps = node.memoizedProps || {}
    let props = _.omit(_.pickBy(memoizedProps, (value, key) => !_.isObject(value)), ['isEnabled'])
    // pick image uri attr from props
    if (_.isArray(memoizedProps.source) && memoizedProps.source.length > 0) {
      let uri = _.get(memoizedProps, 'source[0].uri', null)
      if (!_.isEmpty(uri)) {
        props.uri = uri
      }
    }
    attr = _.merge(props, attr)

    return md5(JSON.stringify(attr))
  }

  _findRootNode (moduleName, sceneName, node) {
    let isTab = false
    if (TabConfig[moduleName]) {
      isTab = !!(_.findKey(TabConfig[moduleName], item => _.findIndex(item, tabName => tabName === sceneName) >= 0))
    }

    if (isTab) {
      let currentNode = node
      while (currentNode && currentNode.return) {
        currentNode = currentNode.return
      }
      return currentNode
    } else {
      return node
    }
  }

  _markNodeKeys (rootNode) {
    let currentNode
    let nodeQueue = [rootNode]
    while (nodeQueue.length > 0) {
      currentNode = nodeQueue.shift()
      let flag = this._getNodeKey(currentNode, rootNode)
      currentNode._debugSource = flag
      if (currentNode.alternate) {
        currentNode.alternate._debugSource = flag
      }
      if (currentNode.child) {
        nodeQueue.push(currentNode.child)
      }
      if (currentNode.sibling) {
        nodeQueue.push(currentNode.sibling)
      }
    }
  }

  _isTouchable (node) {
    let onPress = _.get(node, 'memoizedProps.onPress', null)
    // let isEnabled = _.get(node, 'memoizedProps.isEnabled', false)
    let isEnabled = true
    let disabled = _.get(node, 'memoizedProps.disabled', false)
    let touchableObject = _.get(node, 'memoizedState.touchable', null)
    let type = node.type
    if (_.isFunction(type) && _.isString(type.displayName)) {
      type = type.displayName
    } else if (_.isFunction(type) && _.isString(type.name)) {
      type = type.name
    } else if (!_.isString(type)) {
      type = ''
    }

    return _.isFunction(onPress) &&
      ((isEnabled && !disabled && !_.isEmpty(touchableObject)) || // touchable with onPress
      (type === 'Text')) // text with onPress
  }

  // 给元素添加 ignoreTraversal 属性，标记该元素跳过遍历
  _isIgnored (node) {
    return _.get(node, 'memoizedProps.ignoreTraversal', false)
  }

  _getTouchableMethod (node) {
    return _.get(node, 'memoizedProps.onPress', null)
  }

  _findMeasure (node) {
    let measure
    while (node && !measure) {
      measure = _.get(node, 'stateNode.measure')
      node = node.child
    }
    return measure
  }

  _findNodes (moduleName, sceneName, entrance) {
    let currentNode
    try {
      currentNode = ReactNativeComponentTree.getInstanceFromNode(findNodeHandle(entrance))
    } catch (e) {
      this._onBreakOldTraversal()
      return
    }

    this.traversing = true
    this.current.moduleName = moduleName
    this.current.sceneName = sceneName
    this.current.navigation = _.get(entrance, 'props.navigation', null)

    if (this._isMatchBlacklist() || !this._isMatchWhitelist()) {
      this._onTraversalEnd()
      return
    }

    const rootNode = this._findRootNode(moduleName, sceneName, currentNode)
    this._markNodeKeys(rootNode)
    let nodeList = []
    let nodeQueue = [rootNode]

    while (nodeQueue.length > 0) {
      currentNode = nodeQueue.shift()
      if (!this._isIgnored(currentNode) && this._isTouchable(currentNode)) {
        nodeList.push(currentNode)
      }

      if (!this._isIgnored(currentNode) && currentNode.child) { // 父节点被屏蔽，子节点同样被屏蔽
        nodeQueue.push(currentNode.child)
      }
      if (currentNode.sibling) {
        nodeQueue.push(currentNode.sibling)
      }
    }

    this.current.nodeList = nodeList
    // console.log('[start]: ' + this.current.moduleName + ' ' + this.current.sceneName + ' get nodes = ' + nodeList.length)

    let formerModule = _.get(this.preorder, 'former.moduleName')
    let formerScene = _.get(this.preorder, 'former.sceneName')
    if (this.replay &&
        !_.isEmpty(formerModule) &&
        !_.isEmpty(formerScene) &&
        this.current.moduleName === formerModule &&
        this.current.sceneName === formerScene) {
      this.replay = false // 回放到达目标页面，停止回放
    }

    // this.traversing = false
    this.current.timer = setTimeout(() => {
      this._traversal(0)
    })
  }

  _onMeasure (x, y, w, h) {
    if (this.ref) {
      this.ref.setMarkPosition(x, y, w, h)
    }
  }

  _traversal (index) {
    if (!this.traversing) {
      this._onBreakOldTraversal()
      return
    }

    let _processElement = func => {
      this.dataRecorder.record(`[traversal]${this.current.moduleName}_${this.current.sceneName}_${this.current.nodeList[index]._debugSource}`)
      _.set(this.preorder, [this.current.moduleName, this.current.sceneName, 'nodeMark'], this.current.nodeList[index]._debugSource)
      _.set(this.preorder, 'former.moduleName', this.current.moduleName)
      _.set(this.preorder, 'former.sceneName', this.current.sceneName)

      try {
        func()
      } catch (e) {
        this.recordError(e)
      }

      this.current.timer = setTimeout(() => {
        this._traversal(index + 1)
      }, 2000)
    }

    let _replay = func => {
      try {
        this.dataRecorder.record(`[replay]${this.current.moduleName}_${this.current.sceneName}_${this.current.nodeList[index]._debugSource}`)
        func()
      } catch (e) {

      }
    }

    if (this.current.nodeList && index < this.current.nodeList.length) {
      let node = this.current.nodeList[index]
      let isReplay = this.replay && !_.isEmpty(node._debugSource) && _.get(this.preorder, [this.current.moduleName, this.current.sceneName, 'nodeMark']) === node._debugSource

      if (!this.isVisit[this.current.moduleName][this.current.sceneName][node._debugSource] ||
          isReplay
      ) {
        this.isVisit[this.current.moduleName][this.current.sceneName][node._debugSource] = true
        let func = this._getTouchableMethod(node)
        if (_.isFunction(func)) {
          let measure = this._findMeasure(node)
          if (measure) {
            try {
              measure((x, y, w, h, px, py) => {
                this._onMeasure(px, py, w, h)
                setTimeout(() => {
                  isReplay ? _replay(func) : _processElement(func)
                }, 1000)
              })
            } catch (e) {
              isReplay ? _replay(func) : _processElement(func)
            }
          } else {
            isReplay ? _replay(func) : _processElement(func)
          }
        } else {
          this.current.timer = setTimeout(() => {
            this._traversal(index + 1)
          })
        }
      } else {
        this.current.timer = setTimeout(() => {
          this._traversal(index + 1)
        })
      }
    } else {
      this.dataRecorder.record(`[finished]${this.current.moduleName}_${this.current.sceneName}`)
      _.set(this.preorder, [this.current.moduleName, this.current.sceneName, 'nodeMark'], undefined) // remove from preorder collections
      this.traversing = false
      this._onTraversalEnd()
    }
  }

  _onTraversalEnd () {
    if (this.current.moduleName === 'home') {
      return
    }

    if (this.current.navigation) {
      const {
        goBack,
        state: {
          key
        }
      } = this.current.navigation
      if (goBack && key) {
        this.finishMarkOnBack = true
        goBack(key)
      }
    }
  }

  _isCurrentScene (moduleName, sceneName) {
      let routeName = _.get(AppNavigator, 'currentScene.routeName', '')
      let currentScene
      if (!_.isEmpty(routeName)) {
        currentScene = routeName.split('/')
      } else if (!_.isEmpty(InitialScene) && !_.isEmpty(InitialScene.moduleName) && !_.isEmpty(InitialScene.sceneName)) {
        currentScene = [InitialScene.moduleName, InitialScene.sceneName]
      }

      return !_.isEmpty(currentScene) &&
          !(TabConfig[currentScene[0]] && TabConfig[currentScene[0]][currentScene[1]]) &&
          (moduleName === currentScene[0] && sceneName === currentScene[1])
  }

  _isCurrentTab (moduleName, sceneName) {
      let routeName = _.get(AppNavigator, 'currentScene.routeName', '')
      let currentScene
      if (!_.isEmpty(routeName)) {
          currentScene = routeName.split('/')
      } else if (!_.isEmpty(InitialTab) && !_.isEmpty(InitialTab.tabModule) && !_.isEmpty(InitialTab.tabName)) {
          currentScene = [InitialTab.tabModule, InitialTab.tabName]
      }

      return !_.isEmpty(currentScene) &&
          (!this.activeTab.tabModule && !this.activeTab.tabName) ||
          ((TabConfig[currentScene[0]] && TabConfig[currentScene[0]][currentScene[1]]) && moduleName === currentScene[0] && moduleName === this.activeTab.tabModule && sceneName === this.activeTab.tabName)
  }

  _isMatchWhitelist () {
    return this._isMatchConfig(this.whitelist, true)
  }

  _isMatchBlacklist () {
    return this._isMatchConfig(this.blacklist, false)
  }

  _isMatchConfig (config, defaultValue = false) {
    if (!_.isEmpty(config) && !_.isEmpty(this.current.moduleName) && !_.isEmpty(this.current.sceneName)) {
      let moduleConfig = config[this.current.moduleName]
      return ((_.isString(moduleConfig) && moduleConfig === '*') ||
        (_.isArray(moduleConfig) && _.findIndex(moduleConfig, item => item === this.current.sceneName) >= 0))
    } else {
      return defaultValue
    }
  }

  runTest (moduleName, sceneName, sceneInstance) {
    if (!_.has(this.isVisit, moduleName)) {
      this.isVisit[moduleName] = {}
    }
    if (!_.has(this.isVisit[moduleName], sceneName)) {
      this.isVisit[moduleName][sceneName] = {}
    }

    if (TabConfig[moduleName] && TabConfig[moduleName][sceneName]) {
      return
    }

    if (this._isCurrentScene(moduleName, sceneName) || this._isCurrentTab(moduleName, sceneName)) {
      if (!this.traversing) {
        this.isPrepared ? this._findNodes(moduleName, sceneName, sceneInstance) : this._cacheAction(moduleName, sceneName, sceneInstance)
      }
    }
  }

  _onBreakOldTraversal () {
    if (this.current.timer) {
      clearTimeout(this.current.timer)
    }
    this.traversing = false
    this.current.moduleName = null
    this.current.sceneName = null
    this.current.navigation = null
    this.current.nodeList = null
    this._onMeasure(0, 0, 0, 0) // reset
  }

  onNavigate (moduleName, sceneName) {
    this._onBreakOldTraversal()
  }

  onBack () {
    this._onBreakOldTraversal()
    this.replay = !this.finishMarkOnBack
    this.finishMarkOnBack = false
  }

  registerTab (moduleName, sceneName) {
    this.activeTab.tabModule = moduleName
    this.activeTab.tabName = sceneName
  }

  unregisterTab (moduleName, sceneName) {
    if (this.current.moduleName === moduleName && this.current.sceneName === sceneName) {
      this._onBreakOldTraversal()
    }
  }

  onDrawerOpen () {
    try {
      if (this.current.navigation) {
        this.current.navigation.navigate('DrawerClose')
      }
    } catch (e) {

    }
  }

  setRef (_ref) {
    if (_ref && _ref.constructor.displayName === 'ElementMark') {
      this.ref = _ref
    }
  }

  recordError (error) {
    this.dataRecorder.record(`[error]${this.current.moduleName}_${this.current.sceneName}_${error && error.message}`)
  }

  _cacheAction (moduleName, sceneName, entrance) {
    this.cacheAction = {
      moduleName,
      sceneName,
      entrance
    }
  }

  _onDataRecorderMessage (type, content) {
    switch (type) {
      case 'prepare':
        if (!_.isEmpty(content) && !_.isEmpty(content.records) && _.isArray(content.records)) {
          // load recent records
          this.isVisit = {}
          _.forEach(content.records, record => {
            if (!_.isEmpty(record)) {
              let items = record
                  .replace('[traversal]', '')
                  .trim()
                  .split('_')
              if (items.length === 3 &&
                !_.isEmpty(items[0]) &&
                !_.isEmpty(items[1]) &&
                !_.isEmpty(items[2])) {
                let moduleName = items[0]
                let sceneName = items[1]
                let nodeMark = items[2]
                _.set(this.isVisit, [moduleName, sceneName, nodeMark], true)
              }
            }
          })
        }

        // load strategy
        if (!_.isEmpty(content) && !_.isEmpty(content.strategy)) {
          this.whitelist = _.get(content.strategy, 'whitelist', null)
          this.blacklist = _.get(content.strategy, 'blacklist', null)
        }

        this.isPrepared = true
        if (!_.isEmpty(this.cacheAction)) {
          let cacheModuleName = this.cacheAction.moduleName
          let cacheSceneName = this.cacheAction.sceneName
          let cacheEntrance = this.cacheAction.entrance
          this.cacheAction = null
          this.runTest(cacheModuleName, cacheSceneName, cacheEntrance)
        }
        break
      case 'close':
        break
    }
  }
}

class DataRecorder {
  constructor (messenger) {
    this.websocket = null
    this.connect()
    this.messenger = messenger
  }

  connect (callback) {
    this.websocket = new window.WebSocket('ws://localhost:3000/socket.io/?EIO=4&transport=websocket')

    this.websocket.onopen = evt => {
      this._startHeartBeat()
      if (_.isFunction(callback)) {
        callback()
      }
    }

    this.websocket.onmessage = evt => {
      let data = evt.data
      let dataType = data && data.length > 0 && data[0] || ''
      switch (dataType) {
        case '0':
          this._onHandShake()
          break
        case '3':
          this._onHeartBeat()
          break
        case '4':
          this._onBizMessage(data.slice(1))
          break
      }
    }

    this.websocket.onclose = evt => {
      this._stopHeartBeat()
      this.messenger('close')
    }

    this.websocket.error = evt => {

    }
  }

  record (message) {
    let _doSend = () => {
      try {
        this.websocket.send(`42["message", "${message}"]`)
      } catch (e) {

      }
    }
    if (!_.isEmpty(message)) {
      if (this.websocket === null || this.websocket.readyState === window.WebSocket.CLOSED) {
        this.connect(_doSend)
      } else if (this.websocket.readyState === window.WebSocket.OPEN) {
        _doSend()
      }
    }
  }

  _startHeartBeat () {
    this.intervalTimer = setInterval(() => {
      if (this.websocket !== null && this.websocket.readyState === window.WebSocket.OPEN) {
        try {
          this.websocket.send('2probe')
        } catch (e) {

        }
      }
    }, 3000)
  }

  _stopHeartBeat () {
    clearInterval(this.intervalTimer)
  }

  _onHandShake () {

  }

  _onHeartBeat () {

  }

  _onBizMessage (message) {
    if (_.isEmpty(message)) {
      return
    }
    let paramsLengthStr = _.join(_.takeWhile(message, char => char !== '['), '')
    let paramsLength = parseInt(paramsLengthStr)
    if (paramsLength > 0) {
      try {
        let params = JSON.parse(message.slice(paramsLengthStr.length))
        if (!_.isEmpty(params) && paramsLength === 2 && _.isFunction(this.messenger)) {
          this.messenger(params[0], params[1])
        }
      } catch (e) {

      }
    }
  }
}

export default new SceneTraversal()
