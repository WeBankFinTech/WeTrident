/**
 * 负责导出此模块的reducer和action到App级别
 *
 * Created by rcrabwu on 2019-10-24T08:40:34.034Z.
 */
export default {
  moduleName: 'tabExample',
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
}

