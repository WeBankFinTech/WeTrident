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
    const wrappedModule = createModuleConnect(moduleItem)()

    const wrappedSceneList = []
    reducers[moduleItem.moduleName] = combineReducers({
      ['modulePrivate']: wrappedModule.reducer,
      ...(moduleItem.sceneList.reduce((result, getSceneItem) => {
        const sceneConfig = getSceneItem(container, wrappedModule)
        const wrappedScene = createSceneConnect(sceneConfig)(sceneConfig.component)
        wrappedSceneList.push(wrappedScene)
        return {
          ...result,
          [wrappedScene]: wrappedScene.reducer
        }
      }, {}))
    })
    routers[moduleItem.moduleName] = mapRouter(wrappedSceneList)
  })

  return {
    routers: routers,
    reducer: combineReducers(reducers),
    toString: () => 'modules'
  }
}
