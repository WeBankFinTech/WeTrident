export default class ReducerManager {
  /**
   * 创建navigation的reducer
   * @param entryScene
   * @param navigator
   * @param stateChangeListener
   * @returns {function(*=, *=): (*|{routes, index, isTransitioning, key}|{routes, index, isTransitioning}|{isTransitioning})}
   */
  static createNavReducer (entryScene, navigator, stateChangeListener) {
    const entryAction = navigator.router.getActionForPathAndParams(entryScene)
    const initialState = navigator.router.getStateForAction(entryAction)
    return (state, action) => {
      const nextState =  navigator.router.getStateForAction(action, state || initialState)
      stateChangeListener && stateChangeListener(state || initialState, nextState, action)
      return nextState
    }
  }

}
