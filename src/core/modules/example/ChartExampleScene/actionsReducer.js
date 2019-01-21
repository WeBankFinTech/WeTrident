/**
 * Created by sines on 2018-02-23T10:25:07.640Z.
 */
import { createSceneConnect } from '../../../../utils'
import ModulePrivate from '../actionsReducer'

const sceneConfig = {
  moduleName: ModulePrivate.moduleName,
  sceneName: 'ChartExampleScene',
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
    // addCount: (state, action) => ({...state, count: state.count + action.payload}),
  },

  /**
   * 将module级别的共享数据映射到props
   */
  mapModuleState: state => ({
    // moduleCount: state.count
  }),

  /**
   * 将global级别的共享数据映射到props
   */
  mapGlobalState: state => ({
    // globalCount: state.count
  }),

  /**
   * 将module级别的actions映射到props
   */
  moduleActions: {
    // updateModuleCount: ModulePrivate.actions.updateCount,
  },

  /**
   * 将global级别的actions映射到props
   */
  globalActions: {
    // updateGlobalCount: global.actions.updateCount,
  },

  /**
   * 开启后，页面创建时自动重置为初始状态，默认为 true
   * @type {boolean}
   */
  autoResetState: true
}

export default createSceneConnect(sceneConfig)
