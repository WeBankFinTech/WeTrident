import React, { Component } from 'react'
import WeTouchableHighlight from './WeTouchableHighlight'
import WeTouchableOpacity from './WeTouchableOpacity'
import WeTouchableMask from './WeTouchableMask'
import PropTypes from 'prop-types'
import _ from 'lodash'
import TridentStat from '../../library/statistics/TridentStat'
import NavigationUtils from '../../library/navigation/NavigationUtils'

const PRESS_MODE = Object.freeze({
  opacity: 'opacity',
  highlight: 'highlight',
  mask: 'mask',
  none: 'none'
})

class WeTouchable extends Component {
  static pressMode = PRESS_MODE
  static propTypes = {
    disabled: PropTypes.bool,
    activeOpacity: PropTypes.number,
    onPress: PropTypes.func.isRequired,
    backgroundColor: PropTypes.string,
    isEnabled: PropTypes.bool,
    pressMode: PropTypes.oneOf([
      PRESS_MODE.opacity,
      PRESS_MODE.highlight,
      PRESS_MODE.mask,
      PRESS_MODE.none
    ]),

    // highlight
    activeColor: PropTypes.string,
    activeType: PropTypes.string
  }

  static defaultProps = {
    isEnabled: true,
    rid: ''
  }
  static contextTypes = {
    moduleName: PropTypes.string,
    sceneName: PropTypes.string,
    channelName: PropTypes.string
  }

  constructor () {
    super(...arguments)
    this.isEnabled = this.props.isEnabled
  }

  componentWillReceiveProps (newProps) {
    if (newProps.isEnabled !== this.props.isEnabled) {
      this.isEnabled = newProps.isEnabled
    }
  }

  render () {
    switch (this.props.pressMode) {
      case PRESS_MODE.highlight:
        return (
          <WeTouchableHighlight {...this.props} onPress={() => this.onPress()}>
            {this.props.children}
          </WeTouchableHighlight>
        )
      case PRESS_MODE.mask:
        return (
          <WeTouchableMask {...this.props} onPress={() => this.onPress()}>
            {this.props.children}
          </WeTouchableMask>
        )
      case PRESS_MODE.none: {
        const props = {
          ...this.props,
          activeOpacity: 1
        }
        return (
          <WeTouchableOpacity {...props} onPress={() => this.onPress()}>
            {this.props.children}
          </WeTouchableOpacity>
        )
      }
      default:
        return (
          <WeTouchableOpacity {...this.props} onPress={() => this.onPress()}>
            {this.props.children}
          </WeTouchableOpacity>
        )
    }
  }

  // 获取按钮中文本信息
  _getButtonDesc () {
    // 目前可以解析的节点类型
    let result = ''
    let breakPoint = null
    const supportVNodeList = ['Text', 'Icon', 'Image']
    const _getDesc = (vNode) => {
      switch (_getNodeName(vNode)) {
        case 'Text':
          return _.get(vNode, 'props.children', '')
        case 'Icon':
          return _.get(vNode, 'props.name', '')
        case 'Image':
          return _.get(vNode, 'props.source.uri', '')
      }
    }
    const _getNodeName = (children) => _.get(children, 'type.displayName', '')
    const _getChildren = (children) => _.get(children, 'props.children', '')
    const _isSupportType = (vNode) => supportVNodeList.includes(_getNodeName(vNode))

    // 解析节点
    const _resolveNode = (vNode) => {
      if (_isSupportType(vNode) && _getDesc(vNode)) {
        breakPoint = true
        result = _getDesc(vNode)
      } else if (_getChildren(vNode)) {
        let child = _getChildren(vNode)
        if (_.isArray(child)) {
          for (let key in child) {
            !breakPoint && _resolveNode(child[key])
          }
        } else {
          !breakPoint && _resolveNode(child)
        }
      } else if (_.isArray(vNode)) {
        for (let key in vNode) {
          !breakPoint && _resolveNode(vNode[key])
        }
      } else {
      }
    }

    if (this.props.children) {
      _resolveNode(this.props.children)
    }

    // 处理result
    if (result && _.isString(result)) {
      return result
    } else if (result && _.isArray(result) && _.isString(result[0])) {
      return result[0]
    } else {
      return '不支持的节点需要添加:' + _getNodeName(this.props.children)
    }
  }

  onPress () {
    let {
      onPress: originOnPress = () => {},
      throttleOnPress = true
    } = this.props

    if (throttleOnPress) {
      if (!this .isEnabled) {
        console.log('throttle!!')
        return
      }

      TridentStat.emitStatEvent({
        type: TridentStat.StatType.userAction,
        payload: {
          id: this._getButtonDesc(),
          currentURL: NavigationUtils.generateRouteName(this.context.moduleName, this.context.sceneName)
        }
      })
      originOnPress()
    } else {
      originOnPress()
    }
  }
}

WeTouchable.PressMode = PRESS_MODE
WeTouchable.pressMode= PRESS_MODE

export default WeTouchable
