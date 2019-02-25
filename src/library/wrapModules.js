import { combineReducers } from 'redux'
import { createModuleConnect, createSceneConnect } from './reduxUtils'

export default (moduleList, container) => {
  const reducers = {}
  const routers = {}

  const mapRouter = (sceneList) => {
    const routerConfigs = {}
    sceneList.forEach(scene => {
      routerConfigs[scene] = {
        screen: scene,
        navigationOptions: () => ({
          title: scene.toString()
        })
      }
    })
    return routerConfigs
  }


  moduleList.forEach(moduleItem => {
    const wrappedModule = createModuleConnect(moduleItem.config)(moduleItem.component)

    const wrappedSceneList = []
    reducers[moduleItem.config.moduleName] = combineReducers({
      ['modulePrivate']: wrappedModule.reducer,
      ...(moduleItem.sceneList.reduce((result, sceneItem) => {
        const wrappedScene = createSceneConnect(sceneItem.createConfig(container, wrappedModule))(sceneItem.component)
        wrappedSceneList.push(wrappedScene)
        return {
          ...result,
          [wrappedScene]: wrappedScene.reducer
        }
      }, {}))
    })
    routers[moduleItem.config.moduleName] = mapRouter(wrappedSceneList)
  })

  return {
    routers: routers,
    reducer: combineReducers(reducers),
    toString: () => 'modules'
  }
}
