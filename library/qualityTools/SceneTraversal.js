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
  }

  _getNodeKey (VTTNode, VTTRootNode) {
    const node = VTTNode.element
    let attr = _.pick(node, ['index', 'key', 'tag'])
    const type = node.type
    if (_.isFunction(type) && _.isString(type.displayName)) {
      attr.type = type.displayName
    } else if (_.isFunction(type) && _.isString(type.name)) {
      attr.type = type.name
    } else if (_.isString(type)) {
      attr.type = type
    }
    attr._className = (node.stateNode && node.stateNode.constructor.name) || ''
    attr._parentKey = (VTTNode.return && VTTNode.return.child !== VTTRootNode && VTTNode.return.hash) || ''

    const memoizedProps = node.memoizedProps || {}
    const props = _.omit(_.pickBy(memoizedProps, (value, key) => !_.isObject(value)), ['isEnabled'])
    // pick image uri attr from props
    if (_.isArray(memoizedProps.source) && memoizedProps.source.length > 0) {
      const uri = _.get(memoizedProps, 'source[0].uri', null)
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

  _constructVTT (rootNode) {
    const VTTRootNode = { element: rootNode }
    let currentNode
    const nodeQueue = [VTTRootNode]
    while (nodeQueue.length > 0) {
      currentNode = nodeQueue.shift()
      currentNode.hash = this._getNodeKey(currentNode, VTTRootNode)

      if (currentNode.element.child) {
        currentNode.child = { element: currentNode.element.child, return: currentNode }
        nodeQueue.push(currentNode.child)
      }
      if (currentNode.element.sibling) {
        currentNode.sibling = { element: currentNode.element.sibling, return: currentNode.return }
        nodeQueue.push(currentNode.sibling)
      }
    }

    return VTTRootNode
  }

  _isTouchable (node) {
    const onPress = _.get(node, 'memoizedProps.onPress', null)
    // let isEnabled = _.get(node, 'memoizedProps.isEnabled', false)
    const isEnabled = true
    const disabled = _.get(node, 'memoizedProps.disabled', false)
    const touchableObject = _.get(node, 'memoizedState.touchable', null)
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
    let entranceNode
    try {
      entranceNode = ReactNativeComponentTree.getInstanceFromNode(findNodeHandle(entrance))
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

    const rootNode = this._constructVTT(this._findRootNode(moduleName, sceneName, entranceNode))
    const nodeList = []
    const nodeQueue = [rootNode]
    let currentNode

    const _isTabRootNode = node => !_.isEmpty(node) && !_.isEmpty(node.stateNode) && node.stateNode.constructor.name === 'TabView'
    const _flattenTabViewElements = tabRootNode => {
      const results = []
      const _tabViews = {}
      let _tabNode
      let tabNodeQueue = [tabRootNode]

      // find out mathed tabs and contents
      while (tabNodeQueue.length > 0) {
        _tabNode = tabNodeQueue.shift()
        if (!this._isIgnored(_tabNode.element)) {
          const _tabName = _tabNode.element.key
          if (!_.isEmpty(_tabName) && _.get(_tabNode, 'element.type.displayName') === 'TouchableWithoutFeedback') {
            if (_.isEmpty(_tabViews[_tabName])) {
              _tabViews[_tabName] = {}
            }
            _tabViews[_tabName].tab = _tabNode
          } else if (!_.isEmpty(_tabName) && _.get(_tabNode, 'element.type.displayName') === 'ResourceSavingSceneView') {
            if (_.isEmpty(_tabViews[_tabName])) {
              _tabViews[_tabName] = {}
            }
            _tabViews[_tabName].content = _tabNode
          }

          _tabNode.child && tabNodeQueue.push(_tabNode.child)
        }

        if (_tabNode !== tabRootNode && _tabNode.sibling) {
          tabNodeQueue.push(_tabNode.sibling)
        }
      }

      _.forEach(_tabViews, tabView => {
        if (!_.isEmpty(tabView.tab) && !_.isEmpty(tabView.content)) {
          // tab
          tabNodeQueue = [tabView.tab]
          while (tabNodeQueue.length > 0) {
            _tabNode = tabNodeQueue.shift()
            if (!this._isIgnored(_tabNode.element)) {
              this._isTouchable(_tabNode.element) && results.push(_tabNode)
              _tabNode.child && tabNodeQueue.push(_tabNode.child)
            }

            if (_tabNode !== tabView.tab && _tabNode.sibling) {
              tabNodeQueue.push(_tabNode.sibling)
            }
          }

          // content
          tabNodeQueue = [tabView.content]
          while (tabNodeQueue.length > 0) {
            _tabNode = tabNodeQueue.shift()
            if (!this._isIgnored(_tabNode.element)) {
              this._isTouchable(_tabNode.element) && results.push(_tabNode)
              _tabNode.child && tabNodeQueue.push(_tabNode.child)
            }

            if (_tabNode !== tabView.content && _tabNode.sibling) {
              tabNodeQueue.push(_tabNode.sibling)
            }
          }
        }
      })

      return results
    }

    while (nodeQueue.length > 0) {
      currentNode = nodeQueue.shift()
      if (!this._isIgnored(currentNode.element)) {
        if (_isTabRootNode(currentNode.element)) {
          nodeList.push(..._flattenTabViewElements(currentNode))
        } else {
          this._isTouchable(currentNode.element) && nodeList.push(currentNode)
          currentNode.child && nodeQueue.push(currentNode.child) // 若父节点被屏蔽，子节点同样被屏蔽
        }
      }

      currentNode.sibling && nodeQueue.push(currentNode.sibling)
    }

    this.current.nodeList = nodeList
    // console.log('[start]: ' + this.current.moduleName + ' ' + this.current.sceneName + ' get nodes = ' + nodeList.length)

    const formerModule = _.get(this.preorder, 'former.moduleName')
    const formerScene = _.get(this.preorder, 'former.sceneName')
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

    const _getNodeDesc = node => {
      const _nodeLabel = _.get(node, 'memoizedProps.accessibilityLabel')
      if (!_.isEmpty(_nodeLabel)) {
        return `${_nodeLabel}`
      }

      const _getChildrenDesc = children => {
        while (!_.isEmpty(children)) {
          if (_.isString(children)) {
            return `${children}`
          } else if (_.isArray(children)) {
            return _.reduce(children, (result, _child) => result + _getChildrenDesc(_child), '')
          } else if (_.isObjectLike(children)) {
            let _itemLabel = _.get(children, 'props.data.label')
            if (!_.isEmpty(_itemLabel)) {
              return `${_itemLabel}`
            }

            _itemLabel = _.get(children, 'props.accessibilityLabel')
            if (!_.isEmpty(_itemLabel)) {
              return `${_itemLabel}`
            }

            let _itemName = _.get(children, 'props.name')
            if (!_.isEmpty(_itemName)) {
              return `[图标][${_itemName}]`
            }

            _itemName = _.get(children, 'props.title')
            if (!_.isEmpty(_itemName)) {
              return `${_itemName} ${_.get(children, 'props.subTitle', '')}`
            }

            const _itemLink = _.get(children, 'props.source.uri')
            if (!_.isEmpty(_itemLink)) {
              return `[图标][${_itemLink}]`
            }

            children = _.get(children, 'props.children')
          } else {
            children = null
          }
        }

        return ''
      }

      return `${_getChildrenDesc(_.get(node, 'memoizedProps.children'))}`
    }

    const _processElement = func => {
      this.dataRecorder.record(`[traversal]${this.current.moduleName}_${this.current.sceneName}_${this.current.nodeList[index].hash}`)
      this.dataRecorder.record(`[naming]${this.current.nodeList[index].hash}_${_getNodeDesc(this.current.nodeList[index].element)}`)
      _.set(this.preorder, [this.current.moduleName, this.current.sceneName, 'nodeMark'], this.current.nodeList[index].hash)
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

    const _replay = func => {
      try {
        this.dataRecorder.record(`[replay]${this.current.moduleName}_${this.current.sceneName}_${this.current.nodeList[index].hash}`)
        func()
      } catch (e) {

      }
    }

    if (this.current.nodeList && index < this.current.nodeList.length) {
      const node = this.current.nodeList[index]
      const isReplay = this.replay && !_.isEmpty(node.hash) && _.get(this.preorder, [this.current.moduleName, this.current.sceneName, 'nodeMark']) === node.hash

      if (!this.isVisit[this.current.moduleName][this.current.sceneName][node.hash] ||
          isReplay
      ) {
        this.isVisit[this.current.moduleName][this.current.sceneName][node.hash] = true
        const func = this._getTouchableMethod(node.element)
        if (_.isFunction(func)) {
          const measure = this._findMeasure(node.element)
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
    if (AppNavigator.getCurrentRoutes().length <= 1) {
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
    const routeName = _.get(AppNavigator,
      'currentScene.routeName',
      _.get(_.last(AppNavigator.getCurrentRoutes()), 'routeName', ''))
    let currentScene
    if (!_.isEmpty(routeName)) {
      currentScene = routeName.split('/')
    }

    return !_.isEmpty(currentScene) &&
          !(TabConfig[currentScene[0]] && TabConfig[currentScene[0]][currentScene[1]]) &&
          (moduleName === currentScene[0] && sceneName === currentScene[1])
  }

  _isCurrentTab (moduleName, sceneName) {
    const routeName = _.get(AppNavigator, 'currentScene.routeName', '')
    let currentScene
    if (!_.isEmpty(routeName)) {
      currentScene = routeName.split('/')
    } else if (!_.isEmpty(InitialTab) && !_.isEmpty(InitialTab.tabModule) && !_.isEmpty(InitialTab.tabName)) {
      currentScene = [InitialTab.tabModule, InitialTab.tabName]
    }

    return !_.isEmpty(currentScene) &&
      ((!this.activeTab.tabModule && !this.activeTab.tabName) ||
        ((TabConfig[currentScene[0]] && TabConfig[currentScene[0]][currentScene[1]]) && moduleName === currentScene[0] && moduleName === this.activeTab.tabModule && sceneName === this.activeTab.tabName))
  }

  _isMatchWhitelist () {
    return this._isMatchConfig(this.whitelist, true)
  }

  _isMatchBlacklist () {
    return this._isMatchConfig(this.blacklist, false)
  }

  _isMatchConfig (config, defaultValue = false) {
    if (!_.isEmpty(config) && !_.isEmpty(this.current.moduleName) && !_.isEmpty(this.current.sceneName)) {
      const moduleConfig = config[this.current.moduleName]
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
    this._onMeasure(-1000, -1000, 0, 0) // reset
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

  onDrawerOpen (navigation = this.current.navigation) {
    try {
      if (navigation) {
        setTimeout(() => {
          navigation.navigate('DrawerClose')
        }, 10)
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
              const items = record
                .replace('[traversal]', '')
                .trim()
                .split('_')
              if (items.length === 3 &&
                !_.isEmpty(items[0]) &&
                !_.isEmpty(items[1]) &&
                !_.isEmpty(items[2])) {
                const moduleName = items[0]
                const sceneName = items[1]
                const nodeMark = items[2]
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

        this.defaultGlobalErrorHandler = global.ErrorUtils.getGlobalHandler()
        global.ErrorUtils.setGlobalHandler((error, isFatal) => this.recordError(error))

        this.isPrepared = true
        if (!_.isEmpty(this.cacheAction)) {
          const cacheModuleName = this.cacheAction.moduleName
          const cacheSceneName = this.cacheAction.sceneName
          const cacheEntrance = this.cacheAction.entrance
          this.cacheAction = null
          this.runTest(cacheModuleName, cacheSceneName, cacheEntrance)
        }
        break
      case 'close':
        this.isPrepared = false
        global.ErrorUtils.setGlobalHandler(this.defaultGlobalErrorHandler)
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
      const data = evt.data
      const dataType = (data && data.length > 0 && data[0]) || ''
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
    const _doSend = () => {
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
    const paramsLengthStr = _.join(_.takeWhile(message, char => char !== '['), '')
    const paramsLength = parseInt(paramsLengthStr)
    if (paramsLength > 0) {
      try {
        const params = JSON.parse(message.slice(paramsLengthStr.length))
        if (!_.isEmpty(params) && paramsLength === 2 && _.isFunction(this.messenger)) {
          this.messenger(params[0], params[1])
        }
      } catch (e) {

      }
    }
  }
}

export default new SceneTraversal()
