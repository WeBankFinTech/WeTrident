import React from 'react'
import {
  View
} from 'react-native'
import ProxyWrapper from 'proxy-polyfill/src/proxy'

const Proxy = ProxyWrapper()

const __STYLE__ = '__STYLE__'

const mergeStyle = (target, newStyle) => {
  target[__STYLE__] = {
    ...target[__STYLE__],
    ...newStyle
  }
}

const flexDirectionMap = {
  Row: {flexDirection: 'row'},
  Column: {flexDirection: 'column'}
}

const styleMap = {
  MainSpaceBetween: {justifyContent: 'space-between'},
  MainCenter: {justifyContent: 'center'},
  MainEnd: {justifyContent: 'flex-end'},
  MainStart: {justifyContent: 'flex-start'},

  CrossCenter: {alignItems: 'center'},
  CrossEnd: {alignItems: 'flex-end'},
  CrossStart: {alignItems: 'flex-start'}
}

const getWrapper = () => {
  const target = (props) => {
    const {
      children,
      style,
      restProps
    } = props
    return (
      <View
        {...restProps}
        style={[
          style,
          target[__STYLE__]
        ]}
      >{children}</View>
    )
  }
  Object.assign(target, styleMap)
  return target
}

const getMainTarget = () => {
  const target = getWrapper()
  target[__STYLE__] = {}
  Object.assign(target, styleMap)
  const proxy = new Proxy(target, {
    get(target, p) {
      const style = styleMap[p]
      if (style) {
        mergeStyle(target, style)
        return proxy
      } else {
        return target[p]
      }
    }
  })
  return proxy
}

const getter = (_target, p, receiver) => {
  const target = getMainTarget()
  const style = styleMap[p]
  if (style) {
    mergeStyle(target, {
      // 将Row或Cloumn中的style拷贝到target中
      ..._target[__STYLE__],
      ...style
    })
    return target
  } else {
    return _target[p]
  }
}

// 生成水平布局的function component
const _Row = getWrapper()
mergeStyle(_Row, flexDirectionMap.Row)
const Row = new Proxy(_Row, {
  get: getter
})

// 生成垂直布局的function component
const _Column = getWrapper()
mergeStyle(_Column, flexDirectionMap.Column)
const Column = new Proxy(_Column, {
  get: getter
})

export {
  Row,
  Column
}
