/**
 * 负责导出此模块的reducer和router到App级别
 *
 * Created by erichua on 2019-04-23T03:47:47.051Z.
 */
import { createSceneConnect } from '@unpourtous/trident'

export default {
  moduleName: 'example',
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

