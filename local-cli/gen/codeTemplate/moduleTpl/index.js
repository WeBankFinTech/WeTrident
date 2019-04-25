/**
 * 负责导出此模块的reducer和router到App级别
 *
 * Created by {{author}} on {{createAt}}.
 */
import { createSceneConnect } from '@unpourtous/trident'

export default {
  moduleName: 'TplModuleName',
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

