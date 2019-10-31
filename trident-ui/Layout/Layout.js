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
  CrossStart: {alignItems: 'flex-start'},

  __STYLE__: {}
}

const getMainTarget = () => {
  const target = (props) => {
    return (
      <View
        {...props}
        style={[
          props.style,
          target[__STYLE__]
        ]}
      >{props.children}</View>
    )
  }
  Object.assign(target, styleMap)
  const proxy = new Proxy(target, {
    get(target, p) {
      if (p === __STYLE__) {
        return target[__STYLE__]
      }
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

const Root = (props) => {
  return (
    <View {...props}>{props.children}</View>
  )
}
Object.assign(Root, flexDirectionMap)

const Layout = new Proxy(Root, {
  get(_target, p, receiver) {
    const target = getMainTarget()
    const style = flexDirectionMap[p]
    // console.log(flexDirectionMap, style, p)
    if (style) {
      mergeStyle(target, style)
    }
    // console.log(target[__STYLE__])
    return target
  }
})

const Row = Layout.Row
const Column = Layout.Column
const L = Layout

export {
  Row,
  Column,
  Layout,
  L
}
