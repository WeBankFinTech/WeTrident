import { combineReducers } from 'redux'
import combineModuleReducers from '../../library/reduxUtils/combineModuleReducers'
import mapRouter from '../../library/navigation/mapRouter'

const moduleList =  require('./moduleList').default
const reducers = {}
moduleList.forEach((moduleItem) => {
  reducers[moduleItem] = combineModuleReducers(moduleItem)
})

const routers = {}
moduleList.forEach((item) => {
  routers[item] = mapRouter(item.sceneList)
})

export default {
  routers: routers,
  reducer: combineReducers(reducers),
  toString: () => 'modules'
}
