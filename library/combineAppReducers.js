import { combineReducers } from 'redux'

export default (entryScene, connectedContainer, modules, navigator, stateChangeListener = () => {}) => {
  const createNavReducer = (entryScene, navigator) => {
    const entryAction = navigator.router.getActionForPathAndParams(entryScene)
    const initialState = navigator.router.getStateForAction(entryAction)
    return (state, action) => {
      const nextState = navigator.router.getStateForAction(action, state || initialState)
      stateChangeListener(state, nextState, action)
      return nextState
    }
  }

  let reducers = combineReducers({
    navigation: createNavReducer(entryScene, navigator),
    [connectedContainer]: connectedContainer.reducer,
    [modules]: modules.reducer
  })

  return (state, action) => reducers(state, action)
}
