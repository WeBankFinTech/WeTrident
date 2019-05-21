import { combineReducers } from 'redux'
import { createModuleConnect, createSceneConnect } from './index.js'

export default (moduleList, container) => {
  const reducers = {}
  const routers = {}

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
    routers[moduleItem.moduleName] = wrappedSceneList.reduce((result, scene) => ({
      ...result,
      [scene]: {
        screen: scene,
        navigationOptions: () => ({
          title: scene.toString()
        })
      }
    }), {})
  })

  return {
    routers: routers,
    reducer: combineReducers(reducers),
    toString: () => 'modules'
  }
}
