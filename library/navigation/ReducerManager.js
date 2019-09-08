export default class ReducerManager {
  /**
   * 创建navigation的reducer
   * @param entryScene
   * @param navigator
   * @returns {function(*=, *=): (*|{routes, index, isTransitioning, key}|{routes, index, isTransitioning}|{isTransitioning})}
   */
  static createNavReducer (entryScene, navigator, stateChangeListener) {
    const entryAction = navigator.router.getActionForPathAndParams(entryScene)
    const initialState = navigator.router.getStateForAction(entryAction)
    return (state, action) => {
      return navigator.router.getStateForAction(action, state || initialState)
    }
  }

}
