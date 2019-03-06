/**
 * Created by erichua on 2019-01-22T08:26:49.198Z.
 */
import { createSceneConnect } from '@unpourtous/trident-core'
// import AService from './AService'
// import global from 'apps/webankPro/container'
import ModulePrivate from '../actionsReducer'

const sceneConfig = {
  moduleName: ModulePrivate.moduleName,
  sceneName: 'AScene',
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
   * 开启后，页面创建时自动重置为初始状态，默认为 false
   * 2018年04月25日 erichua 将默认值改为false，有需要再设置，因为全都设置会导致很多页面不必要的reset导致页面加载缓慢
   * @type {boolean}
   */
  autoResetState: false
}

export default createSceneConnect(sceneConfig)
