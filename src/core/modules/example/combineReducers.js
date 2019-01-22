/* eslint-disable comma-dangle */
/**
 * Created by sines on 2018-02-23T10:24:03.394Z.
 */
import { combineReducers } from 'redux'
import ModulePrivate from './actionsReducer'

export default combineReducers({
  [ModulePrivate]: ModulePrivate.reducer,
  ...(require('./sceneList').default.map(item => ({
    [item]: item.reducer
  })))
})