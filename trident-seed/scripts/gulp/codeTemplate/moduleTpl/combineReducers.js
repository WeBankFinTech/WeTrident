/* eslint-disable comma-dangle */
/**
 * Created by {{author}} on {{createTime}}.
 */
import { combineReducers } from 'redux'
import ModulePrivate from './actionsReducer'
// @AUTO_CODE
/* {{&insertImport}} */
// @AUTO_CODE

export default combineReducers({
  [ModulePrivate]: ModulePrivate.reducer,
  // @AUTO_CODE
  /* {{&insertReducerItem}} */
  // @AUTO_CODE
})
