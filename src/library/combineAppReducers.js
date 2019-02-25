import { combineReducers } from 'redux'
import navigation from 'library/navigation/navigation'

export default (entryScene, container, modules) => {
  let reducers = combineReducers({
    [navigation]: navigation.reducer(entryScene),
    [container]: container.reducer,
    [modules]: modules.reducer
  })

  return (state, action) => reducers(state, action)
}
