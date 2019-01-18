/* eslint-disable comma-dangle */
/**
 * Created by sines on 2018-02-23T10:24:03.394Z.
 */
import { combineReducers } from 'redux'
import ModulePrivate from './actionsReducer'
// @AUTO_CODE
/* */import ChartExampleScene from './ChartExampleScene'
/* {{&insertImport}} */
// @AUTO_CODE

export default combineReducers({
  [ModulePrivate]: ModulePrivate.reducer,
  // @AUTO_CODE
  /* */[ChartExampleScene]: ChartExampleScene.reducer,
  /* {{&insertReducerItem}} */
  // @AUTO_CODE
})
