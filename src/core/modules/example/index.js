/**
 * 负责导出此模块的reducer和router到App级别
 * Created by sines on 2018-02-23T10:24:03.394Z.
 */
import reducer from './combineReducers'
import routers from './routers'
import ModulePrivate from './actionsReducer'

const module = {
  reducer,
  routers,
  toString: () => ModulePrivate.moduleName
}

export default module
