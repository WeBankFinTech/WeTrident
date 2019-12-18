/**
 * 负责导出此模块的reducer和action到App级别
 *
 * Created by {{author}} on {{createAt}}.
 */
export default (moduleName) => ({
  moduleName: moduleName,
  initialState: {
    // moduleCount: 0
  },
  sceneList: require('./manifest').default,
  actions: {
    // addModuleCount: v => v
  },
  asyncActions: (actions) => ({

  }),
  reducers: {
    // addModuleCount: (state, action) => ({ ...state, moduleCount: state.moduleCount + action.payload })
  }
})
