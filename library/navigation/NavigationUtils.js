/**
 * add by lehuading
 * 生成routeName的函数
 * TODO 处理路径相关到内容, 例如路径匹配判断
 */

const routeNameSeparator = '/'

/**
 * 拼装router name，由moduleName和sceneName生成
 * @param moduleName
 * @param sceneName
 * @returns {string}
 */
const generateRouteName = (moduleName, sceneName) => {
  return `${moduleName}${routeNameSeparator}${sceneName}`
}

/**
 * generateRouteName的反向操作
 * @param routeName
 * @returns {*}
 */
const separateRouteName = (routeName) => {
  if (typeof routeName === 'string') {
    const URL = require('url')
    const url = URL.parse('https:///' + routeName, true)
    const temp = String(url.pathname).split(routeNameSeparator)
    if (url.pathname && /^\/\w+\/\w+$/.test(url.pathname)) {
      const result = {
        moduleName: temp[1],
        sceneName: temp[2]
      }
      if (Object.keys(url.query).length > 0) {
        result.params = url.query
      }
      return result
    } else {
      return {}
    }
  } else {
    return {}
  }
}

/**
 * 这里定义的相等是 moduleNameA === moduleNameB && sceneNameA === sceneNameB && _.isDeepEqual(paramsA, paramsB)
 * @type {{super: string, equal: string, sub: string}}
 */
const RouteCompareResult = {
  superset: 'superset', // A >= B
  subset: 'subset', // A <= B
  equal: 'equal', // A === B
  diff: 'dff' // A !== B
}

/**
 * 检查routeA和routeB的关系，返回的结果为ReteCompareResult
 * @param routeA  module/scene?params=1
 * @param routeB
 * @return RouteCompareResult
 */
const compareRoute = (routeA, routeB) => {
  if (!routeA || !routeB) {
    if (routeA === routeB) {
      return RouteCompareResult.equal
    }
    return RouteCompareResult.diff
  }

  const URL = require('url')
  const _ = require('lodash')
  const aURL = URL.parse('https:///' + routeA, true)
  const bURL = URL.parse('https:///' + routeB, true)

  if (aURL.pathname === bURL.pathname) {
    const aKeysLength = Object.keys(aURL.query).length
    const bKeysLength = Object.keys(bURL.query).length
    if (aKeysLength === bKeysLength) {
      if (_.isEqual(aURL.query, bURL.query)) {
        return RouteCompareResult.equal
      } else {
        return RouteCompareResult.diff
      }
    } else {
      let maybeSubset = {}
      let maybeSuperset = {}
      let subset
      if (aKeysLength < bKeysLength) {
        maybeSubset = aURL.query
        maybeSuperset = bURL.query
        subset = 'A'
      } else {
        maybeSubset = bURL.query
        maybeSuperset = aURL.query
        subset = 'B'
      }

      let isSubset = true
      Object.keys(maybeSubset).forEach(key => {
        if (!isSubset) return
        if (maybeSubset[key] !== maybeSuperset[key]) {
          isSubset = false
        }
      })

      if (isSubset && subset === 'A') {
        return RouteCompareResult.subset
      }
      if (isSubset && subset === 'B') {
        return RouteCompareResult.superset
      }
      return RouteCompareResult.diff
    }
  } else {
    return RouteCompareResult.diff
  }
}

module.exports = {
  generateRouteName,
  separateRouteName,

  RouteCompareResult,
  compareRoute
}
