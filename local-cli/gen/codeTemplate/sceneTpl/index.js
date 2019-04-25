/**
 * Created by erichua on 2019-02-23T10:25:07.640Z.
 */
export default (global, ModulePrivate) => ({
  moduleName: ModulePrivate.moduleName,
  sceneName: 'TplScene',
  component: require('./TplScene').default,

  /**
   * 定义scene级别数据的初始值
   */
  initialState: {
    // count: 0,
  },

  /**
   * 定义scene级别的actions
   */
  actions: {
    // addCount: v => v,
  },

  /**
   * 定义scene级别的异步actions
   */
  asyncActions: (actions) => ({
    // addCountAsync: () =>
    //   async dispatch => dispatch(actions.addCount(await Service.requestMockData()))
  }),

  /**
   * 定义scene级别的reducer
   */
  reducers: {
    // addCount: (state, action) => ({
    //   ...state,
    //   count: state.count + action.payload
    // })
  },

  /**
   * 将module级别的共享数据映射到props.modulePrivate
   */
  mapModuleState: state => ({
    // moduleCount: state.moduleCount,
  }),

  /**
   * 将global级别的共享数据映射到props
   */
  mapGlobalState: state => ({
    // globalCount: state.globalCount
  }),

  /**
   * 将module级别的actions映射到props
   */
  moduleActions: {
    // addModuleCount: ModulePrivate.actions.addModuleCount
  },

  /**
   * 将global级别的actions映射到props
   */
  globalActions: {
    addGlobalCount: global.actions.addGlobalCount
  },

  /**
   * 开启后，页面创建时自动重置为初始状态，默认为 true
   * @type {boolean}
   */
  autoResetState: true
})
