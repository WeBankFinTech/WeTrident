import RNEnv from '../utils/RNEnv'

let loggerConfig = {}
if (RNEnv.isDev()) {
  loggerConfig = {
    logger: {
      collapsed: true,
      diff: true,
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
        if (action.type && action.type.indexOf('setSceneStateThatOnlyUseInner') > -1) {
          const temp = action.type.split('/')
          parts.push(`${temp[0]}/setSceneState`)
          parts.push(`(${time})`)
          parts.push(`in ${took && took.toFixed(2)} ms`)
        } else {
          parts.push(`${String(action.type)}`)
          parts.push(`(${time})`)
          parts.push(`in ${took && took.toFixed(2)} ms`)
        }
        return parts.join(' ')
      }
    }
  }
}
export default {
  // logger configuration
  ...loggerConfig
}
