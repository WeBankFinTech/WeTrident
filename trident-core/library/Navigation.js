/**
 * add by lehuading
 * 生成routeName的函数
 */

const routeNameSeparator = '/'

const generateRouteName = (moduleName, sceneName) => {
  return `${moduleName}${routeNameSeparator}${sceneName}`
}

const separateRouteName = (routeName) => {
  if (typeof routeName === 'string') {
    let temp = String(routeName || '').split(routeNameSeparator)
    return {
      moduleName: temp[0],
      sceneName: temp[1]
    }
  } else {
    return {}
  }
}

export {
  generateRouteName,
  separateRouteName
}
