import { combineReducers } from 'redux'
import ReducerManager from '../navigation/ReducerManager'

export default (entryScene, connectedContainer, modules, navigator, stateChangeListener = () => {}) => {
  const reducers = combineReducers({
    navigation: ReducerManager.createNavReducer(entryScene, navigator, stateChangeListener),
    [connectedContainer]: connectedContainer.reducer,
    [modules]: modules.reducer
  })

  return (state, action) => reducers(state, action)
}
