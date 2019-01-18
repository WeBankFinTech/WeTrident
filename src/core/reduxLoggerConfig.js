export default {
  collapsed: true,
  diff: false,
  actionTransformer: (action) => {
    if (
      action.payload &&
      action.payload.__namespace__
    ) {
      return {
        ...action,
        payload: action.payload.payload
      }
    } else {
      return action
    }
  },
  titleFormatter: (action, time, took) => {
    const parts = []
    parts.push(typeof action === 'function' ? '[asyncAction]' : '[action]')
    if (
      action.type.indexOf('setSceneStateThatOnlyUseInner') > -1
    ) {
      const temp = action.type.split('/')
      parts.push(`${temp[0]}/setSceneState`)
      parts.push(`(${time})`)
    } else {
      parts.push(`${String(action.type)}`)
      parts.push(`(${time})`)
    }
    return parts.join(' ')
  }
}