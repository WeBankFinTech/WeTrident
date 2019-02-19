import { combineReducers } from 'redux'
import combineModuleReducers from '../../library/navigation/combineModuleReducers'
import mapRouter from '../../library/navigation/mapRouter'

const moduleList =  require('./moduleList').default
const reducers = {}
moduleList.forEach((item) => {

  reducers[item] = combineModuleReducers(item.sceneList)
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
