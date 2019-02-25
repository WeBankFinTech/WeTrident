import { combineReducers } from 'redux'

export default (moduleList) => {
  const reducers = {}
  // combineReducers
  moduleList.forEach((moduleItem) => {
    reducers[moduleItem] = combineReducers({
      ['modulePrivate']: moduleItem.reducer,
      ...(moduleItem.sceneList.reduce((result, sceneItem) => ({
        ...result,
        [sceneItem]: sceneItem.reducer
      }), {}))
    })
  })

  const mapRouter = (sceneConfig) => {
    const routerConfigs = {}
    sceneConfig.forEach(scene => {
      routerConfigs[scene] = {
        screen: scene,
        navigationOptions: () => ({
          title: scene.toString()
        })
      }
    })
    return routerConfigs
  }

  const routers = {}
  moduleList.forEach((item) => {
    routers[item] = mapRouter(item.sceneList)
  })

  return {
    routers: routers,
    reducer: combineReducers(reducers),
    toString: () => 'modules'
  }
}
