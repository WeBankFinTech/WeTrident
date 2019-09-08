/**
 * 负责导出此模块的reducer和router到App级别
 *
 * Created by erichua on 2019-05-21T11:40:28.905Z.
 */

export default (moduleName) => ({
  moduleName,
  initialState: {
    // moduleCount: 0
  },
  sceneList: require('./manifest').default,
  actions: {
    // addModuleCount: v => v
  },
  asyncActions: (actions) => ({}),
  reducers: {
    // addModuleCount: (state, action) => ({ ...state, moduleCount: state.moduleCount + action.payload })
  }
})
