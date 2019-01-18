import routers from './dyRouters'
import createModulesReducer from './dyReducer'

export default {
  routers,
  createModulesReducer,
  toString: () => 'modules'
}

