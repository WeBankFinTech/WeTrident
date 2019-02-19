import { combineReducers } from 'redux'
import container from './container'
import navigation from '../library/navigation/navigation'

const isDyLoad = require('../library/navigation/dyConfig.json').isDyLoad

let modules
if (isDyLoad) {
  // modules = require('./modules/dyIndex').default
} else {
  modules = require('./modules/index').default
}

export default (entryScene, name, reducer) => {
  let reducers = combineReducers({
    [navigation]: navigation.reducer(entryScene),
    [container]: container.reducer,
    [modules]: isDyLoad ? modules.createModulesReducer(name, reducer) : modules.reducer
  })

  return (state, action) => {
    if (action && action.type === 'initAppData') {
      state = undefined
    }

    return reducers(state, action)
  }
}
