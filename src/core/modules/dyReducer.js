/* eslint-disable comma-dangle */
import { combineReducers } from 'redux'
const cachedModuleReducer = {}

export default (name, reducer) => {
  if (name) {
    cachedModuleReducer[name] = reducer
  }
  return combineReducers({
    // [require('./home').default]: require('./home').default.reducer,
    // [require('./login').default]: require('./login').default.reducer,
    ...cachedModuleReducer,
    ...(name ? {[name]: reducer} : {}),
  })
}
