/**
 * 负责导出此模块的reducer和router到App级别
 * Created by {{author}} on {{createTime}}.
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
