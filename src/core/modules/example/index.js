/**
 * 负责导出此模块的reducer和router到App级别
 * Created by sines on 2018-02-23T10:24:03.394Z.
 */
import ModulePrivate from './actionsReducer'
import { createSceneConnect } from 'library/reduxUtils'

let sceneList = [
  require('./ChartExampleScene').default,
  require('./AScene').default,
  /* {{&insertSceneItem}} */
]

// sceneList = sceneList.map(item => createSceneConnect(item.sceneConfig)(sceneConfig.scene))

export default {
  sceneList,
  reducer: ModulePrivate.reducer,
  toString: () => ModulePrivate.moduleName
}
