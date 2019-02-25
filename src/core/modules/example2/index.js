/**
 * 负责导出此模块的reducer和router到App级别
 * Created by sines on 2018-02-23T10:24:03.394Z.
 */
import { createSceneConnect } from 'library/reduxUtils'

let sceneList = [
  require('./ChartExampleScene').default,
  /* {{&insertSceneItem}} */
]

const config = {
  moduleName: 'example',
  initialState: {
    moduleCount: 0
  },
  actions: {
    addModuleCount: v => v
  },
  asyncActions: (actions) => ({
  }),
  reducers: {
    addModuleCount: (state, action)  => ({...state, moduleCount: state.moduleCount + action.payload})
  }
}

export default {
  sceneList,
  config
}
