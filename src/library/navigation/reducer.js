import { MyStackNavigator } from './WeNavigator'

export default (entryScene, navigator) => {
  const entryAction = navigator.router.getActionForPathAndParams(entryScene)
  const initialState = navigator.router.getStateForAction(entryAction)
  return (state, action) => {
    return navigator.router.getStateForAction(action, state || initialState)
  }
}
