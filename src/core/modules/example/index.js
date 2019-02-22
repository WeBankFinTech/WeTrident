/**
 * 负责导出此模块的reducer和router到App级别
 * Created by sines on 2018-02-23T10:24:03.394Z.
 */
import ModulePrivate from './actionsReducer'

export default {
  sceneList: require('./sceneList').default,
  reducer: ModulePrivate.reducer,
  toString: () => ModulePrivate.moduleName
}
