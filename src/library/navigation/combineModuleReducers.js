import { combineReducers } from 'redux'
import ModulePrivate from '../../core/modules/example/actionsReducer'

export default (sceneList) => combineReducers({
  [ModulePrivate]: ModulePrivate.reducer,
  ...(sceneList.map(item => ({
    [item]: item.reducer
  })))
})