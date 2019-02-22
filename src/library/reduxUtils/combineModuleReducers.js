import { combineReducers } from 'redux'

export default (module) => combineReducers({
  ['ModulePrivate']: module.reducer,
  ...(module.sceneList.reduce((result, item) => ({
    ...result,
    [item]: item.reducer
  }), {}))
})
