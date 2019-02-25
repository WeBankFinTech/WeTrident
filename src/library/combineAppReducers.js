import { combineReducers } from 'redux'

export default (entryScene, container, modules, navigator) => {
  const createNavReducer = (entryScene, navigator) => {
    const entryAction = navigator.router.getActionForPathAndParams(entryScene)
    const initialState = navigator.router.getStateForAction(entryAction)
    return (state, action) => {
      return navigator.router.getStateForAction(action, state || initialState)
    }
  }

  let reducers = combineReducers({
    navigation: createNavReducer(entryScene, navigator),
    [container]: container.reducer,
    [modules]: modules.reducer
  })

  return (state, action) => reducers(state, action)
}
